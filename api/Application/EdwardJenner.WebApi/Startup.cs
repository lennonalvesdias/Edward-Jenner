using EdwardJenner.Cross;
using EdwardJenner.Cross.Interfaces;
using EdwardJenner.Data.Repositories;
using EdwardJenner.Domain.Interfaces.Repositories;
using EdwardJenner.Domain.Interfaces.Services;
using EdwardJenner.Domain.Services;
using EdwardJenner.Models.DTO;
using EdwardJenner.Models.Models;
using EdwardJenner.Models.Security;
using EdwardJenner.Models.Settings;
using EdwardJenner.Security;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace EdwardJenner.WebApi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            ConfigureCors(services);
            ConfigureSecurity(services);
            ConfigureSettings(services);
            ConfigureInjection(services);
            services.AddControllers()
                .AddNewtonsoftJson(option =>
                {
                    var serializerOptions = option.SerializerSettings;
                    serializerOptions.NullValueHandling = NullValueHandling.Ignore;
                });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ApplicationDbContext context, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler(appError =>
                {
                    appError.Run(async httpContext =>
                    {
                        httpContext.Response.ContentType = "application/json";

                        var contextFeature = httpContext.Features.Get<IExceptionHandlerFeature>();
                        if (contextFeature != null)
                        {
                            var errorDetails = new ErrorDetails
                            {
                                Message = contextFeature.Error.Message,
                                ExceptionMessage = contextFeature.Error.InnerException?.Message,
                                ExceptionType = null,
                                StackTrace = contextFeature.Error.StackTrace
                            };

                            await httpContext.Response.WriteAsync(errorDetails.ToString());
                        }
                    });
                });
            }

            new IdentityInitializer(context, userManager, roleManager).Initialize();

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseCors(Configuration.GetSection("CorsSettings:PolicyName").Value);

            app.UseAuthorization();

            app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
        }

        private void ConfigureCors(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy(Configuration.GetSection("CorsSettings:PolicyName").Value, builder =>
                {
                    //builder.WithOrigins(Configuration.GetSection("CorsSettings:Urls").Value.Split(';')).AllowAnyHeader();
                    builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
                });
            });
        }

        private void ConfigureSettings(IServiceCollection services)
        {
            var corsSettings = new CorsSettings();
            new ConfigureFromConfigurationOptions<CorsSettings>(Configuration.GetSection("CorsSettings")).Configure(corsSettings);
            services.AddSingleton(corsSettings);

            var mongoConnection = new MongoConnection();
            new ConfigureFromConfigurationOptions<MongoConnection>(Configuration.GetSection("MongoConnection")).Configure(mongoConnection);
            services.AddSingleton(mongoConnection);

            var redisConnection = new RedisConnection();
            new ConfigureFromConfigurationOptions<RedisConnection>(Configuration.GetSection("RedisConnection")).Configure(redisConnection);
            services.AddSingleton(redisConnection);

            var googleSettings = new GoogleSettings();
            new ConfigureFromConfigurationOptions<GoogleSettings>(Configuration.GetSection("GoogleSettings")).Configure(googleSettings);
            services.AddSingleton(googleSettings);
        }

        private void ConfigureInjection(IServiceCollection services)
        {
            // ASP.NET HttpContext dependency
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            // Domain
            services.AddScoped(typeof(ICacheService<>), typeof(CacheService<>));
            services.AddScoped<IGoogleMapsApi, GoogleMapsApi>();

            // Data
            services.AddScoped<IItemRepository, ItemRepository>();
            services.AddScoped<IOrderRepository, OrderRepository>();
            services.AddScoped<IRatingRepository, RatingRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
        }

        private void ConfigureSecurity(IServiceCollection services)
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseInMemoryDatabase("InMemoryDatabase"));

            services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            services.AddScoped<AccessManager>();

            var signingConfigurations = new SigningConfigurations();
            services.AddSingleton(signingConfigurations);

            var tokenConfigurations = new TokenConfigurations();
            new ConfigureFromConfigurationOptions<TokenConfigurations>(Configuration.GetSection("TokenConfigurations")).Configure(tokenConfigurations);
            services.AddSingleton(tokenConfigurations);

            services.AddJwtSecurity(signingConfigurations, tokenConfigurations);
        }
    }
}
