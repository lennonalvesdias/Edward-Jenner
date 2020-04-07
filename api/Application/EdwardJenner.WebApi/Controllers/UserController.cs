using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EdwardJenner.Domain.Interfaces.Repositories;
using EdwardJenner.Domain.Interfaces.Services;
using EdwardJenner.Models.DTO;
using EdwardJenner.Models.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EdwardJenner.WebApi.Controllers
{
    public class UserController : BaseController
    {
        private readonly IUserRepository _userRepository;
        private readonly ICacheService<User> _cacheService;
        private readonly ICacheService<IList<Phone>> _cachePhoneService;
        private readonly ICacheService<IList<Address>> _cacheAddressService;

        public UserController(IUserRepository userRepository, ICacheService<User> cacheService, ICacheService<IList<Phone>> cachePhoneService, ICacheService<IList<Address>> cacheAddressService)
        {
            _userRepository = userRepository;
            _cacheService = cacheService;
            _cachePhoneService = cachePhoneService;
            _cacheAddressService = cacheAddressService;
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

        [HttpPut]
        [Route("{id}/update-password")]
        public async Task<IActionResult> UpdatePassword(string id, [FromBody] UpdatePassword updatePassword)
        {
            var update = await _userRepository.UpdatePassword(id, updatePassword);

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

        [HttpGet]
        [Route("{id}/phones")]
        public async Task<IActionResult> GetPhones(string id)
        {
            IList<Phone> result;

            try
            {
                result = await _cachePhoneService.GetObjectCache($"ej.user.getphones.{id}");

                if (result == null)
                {
                    result = (await _userRepository.FindBy(x => x.Id == id)).Phones;
                    await _cachePhoneService.SetObjectCache($"ej.user.getphones.{id}", result);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                result = (await _userRepository.FindBy(x => x.Id == id)).Phones;
            }

            return Ok(result);
        }

        [HttpPut]
        [Route("{id}/phones")]
        public async Task<IActionResult> PutPhones(string id, [FromBody] Phone phone)
        {
            var user = await _userRepository.FindBy(x => x.Id == id);

            if (user.Phones.FirstOrDefault(x => x.Type == phone.Type) == null)
            {
                user.Phones.Add(phone);
            }
            else
            {
                user.Phones = user.Phones.Select(x => (x.Type == phone.Type) ? phone : x).ToList();
            }

            await _userRepository.Update(user);

            try
            {
                await _cachePhoneService.RemoveCacheByPattern("ej.user");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            return Ok(user);
        }

        [HttpDelete]
        [Route("{id}/phones")]
        public async Task<IActionResult> DeletePhones(string id, [FromBody] Phone phone)
        {
            var user = await _userRepository.FindBy(x => x.Id == id);
            user.Phones = user.Phones.Where(x => x.Type != phone.Type).ToList();
            await _userRepository.Update(user);

            try
            {
                await _cachePhoneService.RemoveCacheByPattern("ej.user");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            return Ok(user);
        }

        [HttpGet]
        [Route("{id}/addresses")]
        public async Task<IActionResult> GetAddresses(string id)
        {
            IList<Address> result;

            try
            {
                result = await _cacheAddressService.GetObjectCache($"ej.user.getaddresses.{id}");

                if (result == null)
                {
                    result = (await _userRepository.FindBy(x => x.Id == id)).Addresses;
                    await _cacheAddressService.SetObjectCache($"ej.user.getaddresses.{id}", result);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                result = (await _userRepository.FindBy(x => x.Id == id)).Addresses;
            }

            return Ok(result);
        }

        [HttpPut]
        [Route("{id}/addresses")]
        public async Task<IActionResult> PutAddresses(string id, [FromBody] Address address)
        {
            var user = await _userRepository.FindBy(x => x.Id == id);

            if (user.Addresses.FirstOrDefault(x => x.Type == address.Type) == null)
            {
                user.Addresses.Add(address);
            }
            else
            {
                user.Addresses = user.Addresses.Select(x => (x.Type == address.Type) ? address : x).ToList();
            }

            await _userRepository.Update(user);

            try
            {
                await _cacheAddressService.RemoveCacheByPattern("ej.user");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            return Ok(user);
        }

        [HttpDelete]
        [Route("{id}/addresses")]
        public async Task<IActionResult> DeleteAddresses(string id, [FromBody] Address address)
        {
            var user = await _userRepository.FindBy(x => x.Id == id);
            user.Addresses = user.Addresses.Where(x => x.Type != address.Type).ToList();
            await _userRepository.Update(user);

            try
            {
                await _cacheAddressService.RemoveCacheByPattern("ej.user");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            return Ok(user);
        }
    }
}
