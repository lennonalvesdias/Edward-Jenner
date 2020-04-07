using System.Threading.Tasks;
using EdwardJenner.Domain.Interfaces.Repositories;
using EdwardJenner.Models.Security;
using EdwardJenner.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EdwardJenner.WebApi.Controllers
{
    public class ApiController : BaseController
    {
        private readonly IUserRepository _userRepository;

        public ApiController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("ping")]
        public async Task<IActionResult> Ping()
        {
            await _userRepository.ListBy(x => true);
            return Ok(new { ping = "pong" });
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("login")]
        public async Task<object> Login([FromBody]AccessCredentials credentials, [FromServices]AccessManager accessManager)
        {
            if (await accessManager.ValidateCredentialsAsync(credentials))
            {
                return accessManager.GenerateToken(credentials);
            }

            return new { Authenticated = false, Message = "Falha ao autenticar" };
        }
    }
}
