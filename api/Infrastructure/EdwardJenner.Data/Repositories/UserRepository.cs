﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using EdwardJenner.Cross.Interfaces;
using EdwardJenner.Cross.Models;
using EdwardJenner.Domain.Exceptions;
using EdwardJenner.Domain.Interfaces.Repositories;
using EdwardJenner.Domain.Interfaces.Services;
using EdwardJenner.Models.Models;
using EdwardJenner.Models.Security;
using EdwardJenner.Models.Settings;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Internal;
using MongoDB.Driver;
using MongoDB.Driver.GeoJsonObjectModel;

namespace EdwardJenner.Data.Repositories
{
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        private readonly IGoogleMapsApi _googleMapsApi;
        private readonly ICacheService<GoogleGeocodeResult> _cacheGoogleGeocodeService;
        private readonly UserManager<ApplicationUser> _userManager;

        protected override string GetCollectionName()
        {
            return "users";
        }

        public UserRepository(MongoConnection mongoConnection, IGoogleMapsApi googleMapsApi, ICacheService<GoogleGeocodeResult> cacheGoogleGeocodeService, UserManager<ApplicationUser> userManager) : base(mongoConnection)
        {
            _googleMapsApi = googleMapsApi;
            _cacheGoogleGeocodeService = cacheGoogleGeocodeService;
            _userManager = userManager;
            CreateIndexes();
        }

        private void CreateIndexes()
        {
            var keys = Builders<User>.IndexKeys.Geo2DSphere(x => x.Location);
            var model = new CreateIndexModel<User>(keys);
            BaseCollection.Indexes.CreateOne(model);

            keys = Builders<User>.IndexKeys.Text(x => x.Username);
            model = new CreateIndexModel<User>(keys);
            BaseCollection.Indexes.CreateOne(model);
        }

        public async Task<IList<User>> ListByNearAsync(double longitude, double latitude, int distance)
        {
            var point = GeoJson.Point(GeoJson.Geographic(longitude, latitude));
            var filter = Builders<User>.Filter.Near(x => x.Location, point, distance);
            var users = await BaseCollection.Find(filter).ToListAsync();
            foreach (var user in users)
            {
                user.Longitude = user.Location.Coordinates.Longitude;
                user.Latitude = user.Location.Coordinates.Latitude;
                user.Password = null;
            }
            return users;
        }

        public new async Task<User> FindBy(Expression<Func<User, bool>> filter)
        {
            var user = await BaseCollection.Find(filter).FirstOrDefaultAsync();
            user.Password = null;
            return user;
        }

        public new async Task<IList<User>> ListBy(Expression<Func<User, bool>> filter)
        {
            var users = await BaseCollection.Find(filter).ToListAsync();
            foreach (var user in users)
            {
                user.Password = null;
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
            user.HomeAddress.Location = await GetGeopointsByAddress(user.HomeAddress);
            user.Location = new GeoJsonPoint<GeoJson2DGeographicCoordinates>(
                new GeoJson2DGeographicCoordinates(user.Longitude, user.Latitude));
            await BaseCollection.InsertOneAsync(user);
        }

        public new async Task<User> Update(User user)
        {
            await _userManager.UpdateAsync(new ApplicationUser
            {
                Id = user.ApplicationUserId,
                Email = user.Email,
                EmailConfirmed = true
            });

            user.UpdatedIn = DateTime.Now;
            user.HomeAddress.Location = await GetGeopointsByAddress(user.HomeAddress);
            user.Location =
                new GeoJsonPoint<GeoJson2DGeographicCoordinates>(
                    new GeoJson2DGeographicCoordinates(user.Longitude, user.Latitude));
            return await BaseCollection.FindOneAndReplaceAsync(x => x.Id == user.Id, user);
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
