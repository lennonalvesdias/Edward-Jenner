using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;
using EdwardJenner.Domain.Interfaces.Services;
using EdwardJenner.Models.Models;
using EdwardJenner.Models.Security;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using static System.String;

namespace EdwardJenner.Security
{
    public class AccessManager
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly SigningConfigurations _signingConfigurations;
        private readonly TokenConfigurations _tokenConfigurations;
        private readonly ICacheService<string> _cache;

        public AccessManager(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, SigningConfigurations signingConfigurations,
            [FromServices]TokenConfigurations tokenConfigurations, ICacheService<string> cache)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _signingConfigurations = signingConfigurations;
            _tokenConfigurations = tokenConfigurations;
            _cache = cache;
        }

        public async Task<bool> ValidateCredentialsAsync(AccessCredentials credentials)
        {
            var validCredentials = false;
            if (credentials == null || IsNullOrWhiteSpace(credentials.Username)) return false;

            switch (credentials.GrantType)
            {
                case "password":
                    {
                        var userIdentity = await _userManager.FindByNameAsync(credentials.Username);
                        if (userIdentity != null)
                        {
                            var loginResult = _signInManager.CheckPasswordSignInAsync(userIdentity, credentials.Password, false).Result;
                            if (loginResult.Succeeded)
                            {
                                validCredentials = _userManager.IsInRoleAsync(userIdentity, Roles.RoleApiEdwardJenner).Result;
                            }
                        }

                        break;
                    }
                case "refresh_token":
                    {
                        if (!IsNullOrWhiteSpace(credentials.RefreshToken))
                        {
                            RefreshTokenData refreshTokenBase = null;

                            var refreshTokenCache = await _cache.GetStringCache(credentials.RefreshToken);

                            if (!IsNullOrWhiteSpace(refreshTokenCache))
                            {
                                refreshTokenBase = JsonConvert
                                    .DeserializeObject<RefreshTokenData>(refreshTokenCache);
                            }

                            validCredentials = (refreshTokenBase != null && credentials.Username == refreshTokenBase.UserId && credentials.RefreshToken == refreshTokenBase.RefreshToken);

                            if (validCredentials) await _cache.RemoveCache(credentials.RefreshToken);
                        }

                        break;
                    }
            }

            return validCredentials;
        }

        public Token GenerateToken(AccessCredentials credentials)
        {
            var identity = new ClaimsIdentity(
                new GenericIdentity(credentials.Username, "Login"),
                new[] {
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString("N")),
                        new Claim(JwtRegisteredClaimNames.UniqueName, credentials.Username)
                }
            );

            var creationTime = DateTime.Now;
            var expirationTime = creationTime + TimeSpan.FromSeconds(_tokenConfigurations.Seconds);

            var handler = new JwtSecurityTokenHandler();
            var securityToken = handler.CreateToken(new SecurityTokenDescriptor
            {
                Issuer = _tokenConfigurations.Issuer,
                Audience = _tokenConfigurations.Audience,
                SigningCredentials = _signingConfigurations.SigningCredentials,
                Subject = identity,
                NotBefore = creationTime,
                Expires = expirationTime
            });

            var token = handler.WriteToken(securityToken);

            var generateToken = new Token()
            {
                Authenticated = true,
                Created = creationTime.ToString("yyyy-MM-dd HH:mm:ss"),
                Expiration = expirationTime.ToString("yyyy-MM-dd HH:mm:ss"),
                AccessToken = token,
                RefreshToken = Guid.NewGuid().ToString().Replace("-", Empty),
                Message = "OK"
            };

            var refreshTokenData = new RefreshTokenData
            {
                RefreshToken = generateToken.RefreshToken,
                UserId = credentials.Username
            };

            var finalExpiration = TimeSpan.FromSeconds(_tokenConfigurations.FinalExpiration);
            _cache.SetStringCache(generateToken.RefreshToken, JsonConvert.SerializeObject(refreshTokenData), finalExpiration);

            return generateToken;
        }
    }
}
