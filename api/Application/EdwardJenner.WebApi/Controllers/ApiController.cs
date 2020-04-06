using System.Threading.Tasks;
using EdwardJenner.Domain;
using EdwardJenner.Models.Security;
using EdwardJenner.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EdwardJenner.WebApi.Controllers
{
    public class ApiController : BaseController
    {
        public ApiController()
        {
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("ping")]
        public IActionResult Ping()
        {
            return Ok(new { ping = "pong" });
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("login")]
        public async Task<object> Login([FromBody]AccessCredentials credentials, [FromServices]AccessManager accessManager)
        {
            credentials.Password = Helper.GenerateHash(credentials.Password);
            if (await accessManager.ValidateCredentialsAsync(credentials))
            {
                return accessManager.GenerateToken(credentials);
            }

            return new { Authenticated = false, Message = "Falha ao autenticar" };
        }
    }
}
