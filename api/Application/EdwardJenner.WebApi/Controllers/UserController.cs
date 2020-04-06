using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using EdwardJenner.Domain;
using EdwardJenner.Domain.Interfaces.Repositories;
using EdwardJenner.Domain.Interfaces.Services;
using EdwardJenner.Models.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EdwardJenner.WebApi.Controllers
{
    public class UserController : BaseController
    {
        private readonly IUserRepository _userRepository;
        private readonly ICacheService<User> _cacheService;

        public UserController(IUserRepository userRepository, ICacheService<User> cacheService)
        {
            _userRepository = userRepository;
            _cacheService = cacheService;
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            User result;

            try
            {
                result = await _cacheService.GetObjectCache($"ej.user.getbyid.{id}");

                if (result == null)
                {
                    result = await _userRepository.FindBy(x => x.Id == id);
                    await _cacheService.SetObjectCache($"ej.user.getbyid.{id}", result);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                result = await _userRepository.FindBy(x => x.Id == id);
            }

            return Ok(result);
        }

        [HttpGet]
        [Route("")]
        public async Task<IActionResult> List()
        {
            IList<User> result;

            try
            {
                result = await _cacheService.GetObjectListCache("ej.user.listall");

                if (result == null)
                {
                    result = await _userRepository.ListBy(x => true);
                    await _cacheService.SetObjectListCache("ej.user.listall", result);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                result = await _userRepository.ListBy(x => true);
            }

            return Ok(result);
        }

        [HttpPut]
        [Route("")]
        public async Task<IActionResult> Put([FromBody] User user)
        {
            var update = await _userRepository.Update(user);

            try
            {
                await _cacheService.RemoveCacheByPattern("ej.user");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            return Ok(update);
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("")]
        public async Task<IActionResult> Post([FromBody] User user)
        {
            await _userRepository.Insert(user);

            try
            {
                await _cacheService.RemoveCacheByPattern("ej.user");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            return Ok();
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            await _userRepository.Delete(x => x.Id == id);

            try
            {
                await _cacheService.RemoveCacheByPattern("ej.user");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            return Ok();
        }

        [HttpGet]
        [Route("username/{username}")]
        public async Task<IActionResult> GetByUsername(string username)
        {
            User result;

            try
            {
                result = await _cacheService.GetObjectCache($"ej.user.getbyusername.{username}");

                if (result == null)
                {
                    result = await _userRepository.FindBy(x => x.Username == username);
                    await _cacheService.SetObjectCache($"ej.user.getbyusername.{username}", result);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                result = await _userRepository.FindBy(x => x.Username == username);
            }

            return Ok(result);
        }
    }
}
