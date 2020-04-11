using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using EdwardJenner.Cross.Interfaces;
using EdwardJenner.Cross.Models;
using EdwardJenner.Domain.Exceptions;
using EdwardJenner.Domain.Interfaces.Repositories;
using EdwardJenner.Domain.Interfaces.Services;
using EdwardJenner.Models.DTO;
using EdwardJenner.Models.Models;
using EdwardJenner.Models.Security;
using EdwardJenner.Models.Settings;
using Microsoft.AspNetCore.Identity;
using MongoDB.Driver;
using MongoDB.Driver.GeoJsonObjectModel;

namespace EdwardJenner.Data.Repositories
{
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        private readonly IGoogleMapsApi _googleMapsApi;
        private readonly ICacheService<GoogleGeocodeResult> _cacheGoogleGeocodeService;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IRatingRepository _ratingRepository;

        protected override string GetCollectionName() => "users";

        public UserRepository(MongoConnection mongoConnection, IGoogleMapsApi googleMapsApi, ICacheService<GoogleGeocodeResult> cacheGoogleGeocodeService, UserManager<ApplicationUser> userManager, IRatingRepository ratingRepository) : base(mongoConnection)
        {
            _googleMapsApi = googleMapsApi;
            _cacheGoogleGeocodeService = cacheGoogleGeocodeService;
            _userManager = userManager;
            _ratingRepository = ratingRepository;
            CreateIndexes();
            Initialize().ConfigureAwait(false).GetAwaiter().GetResult();
        }

        private void CreateIndexes()
        {
            var keys = Builders<User>.IndexKeys.Text(x => x.Username);
            var model = new CreateIndexModel<User>(keys);
            BaseCollection.Indexes.CreateOne(model);
        }

        private async Task Initialize()
        {
            var users = await BaseCollection.Find(x => true).ToListAsync();
            foreach (var user in users.Where(user => _userManager.FindByNameAsync(user.Username).Result == null))
            {
                var applicationUser = CreateApplicationUser(new ApplicationUser()
                {
                    UserName = user.Username,
                    Email = user.Email,
                    EmailConfirmed = true
                }, user.Password, Roles.RoleApiEdwardJenner);
                user.ApplicationUserId = applicationUser.Id;
                await Update(user);
            }
        }

        public new async Task<User> FindBy(Expression<Func<User, bool>> filter)
        {
            var user = await BaseCollection.Find(filter).FirstOrDefaultAsync();
            foreach (var address in user.Addresses)
            {
                address.Latitude = address.Location.Coordinates.Latitude;
                address.Longitude = address.Location.Coordinates.Longitude;
            }
            user.Password = null;
            user.Ratings = await _ratingRepository.ListBy(x => x.UserId == user.Id);
            return user;
        }

        public new async Task<IList<User>> ListBy(Expression<Func<User, bool>> filter)
        {
            var users = await BaseCollection.Find(filter).ToListAsync();
            foreach (var user in users)
            {
                foreach (var address in user.Addresses)
                {
                    address.Latitude = address.Location.Coordinates.Latitude;
                    address.Longitude = address.Location.Coordinates.Longitude;
                }
                user.Password = null;
                user.Ratings = await _ratingRepository.ListBy(x => x.UserId == user.Id);
            }
            return users;
        }

        public new async Task Insert(User user)
        {
            var applicationUser = CreateApplicationUser(new ApplicationUser
            {
                UserName = user.Username,
                Email = user.Email,
                EmailConfirmed = true
            }, user.Password, Roles.RoleApiEdwardJenner);

            user.ApplicationUserId = applicationUser.Id;
            user.UpdatedIn = DateTime.Now;

            foreach (var address in user.Addresses)
            {
                address.Location = await GetGeopointsByAddress(address);
            }

            await BaseCollection.InsertOneAsync(user);
        }

        public new async Task<User> Update(User user)
        {
            var oldUser = await BaseCollection.Find(x => x.Id == user.Id).FirstOrDefaultAsync();
            user.Password = oldUser.Password;

            user.UpdatedIn = DateTime.Now;

            foreach (var address in user.Addresses)
            {
                address.Location = await GetGeopointsByAddress(address);
            }

            return await BaseCollection.FindOneAndReplaceAsync(x => x.Id == user.Id, user);
        }

        public new async Task Delete(Expression<Func<User, bool>> filter)
        {
            var user = await FindBy(filter);
            var applicationUser = await _userManager.FindByIdAsync(user.ApplicationUserId);
            await _userManager.DeleteAsync(applicationUser);
            await BaseCollection.DeleteManyAsync(filter);
        }

        public async Task<User> UpdatePassword(string id, UpdatePassword updatePassword)
        {
            var user = await FindBy(x => x.Id == id);
            var applicationUser = await _userManager.FindByIdAsync(user.ApplicationUserId);
            var changePasswordResult = await _userManager.ChangePasswordAsync(applicationUser, updatePassword.OldPassword, updatePassword.NewPassword);
            if (!changePasswordResult.Succeeded) throw new BadRequestException(changePasswordResult.ToString());
            user.Password = updatePassword.NewPassword;
            await Update(user);
            user.Password = null;
            return user;
        }

        private ApplicationUser CreateApplicationUser(ApplicationUser user, string password, string initialRole = null)
        {
            if (_userManager.FindByNameAsync(user.UserName).Result != null) throw new BadRequestException("Já existe um usuário com esse username.");

            var result = _userManager.CreateAsync(user, password).Result;

            if (result.Succeeded && !string.IsNullOrWhiteSpace(initialRole))
            {
                _userManager.AddToRoleAsync(user, initialRole).Wait();
            }
            else
            {
                throw new Exception(result.ToString());
            }

            return user;
        }

        private async Task<GeoJsonPoint<GeoJson2DGeographicCoordinates>> GetGeopointsByAddress(Address address)
        {
            var formatAddress = $"{address.Street},{address.Number},{address.City},{address.State}".Replace(" ", "+");

            var homeLocation = await _cacheGoogleGeocodeService.GetObjectCache($"ej-{formatAddress}");
            if (homeLocation == null)
            {
                homeLocation = _googleMapsApi.GetGeocode(formatAddress)?.Results?.FirstOrDefault();
                await _cacheGoogleGeocodeService.SetObjectCache($"ej-{formatAddress}", homeLocation);
            }

            if (homeLocation != null)
            {
                return new GeoJsonPoint<GeoJson2DGeographicCoordinates>(
                    new GeoJson2DGeographicCoordinates(homeLocation.GoogleGeocodeGeometry.GoogleGeocodeLocation.Lng, homeLocation.GoogleGeocodeGeometry.GoogleGeocodeLocation.Lat));
            }
            else
            {
                return null;
            }
        }
    }
}
