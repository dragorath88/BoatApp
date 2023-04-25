#pragma warning disable SA1200 // Using directives should be placed correctly
using System.Text;
using AutoMapper;
using BoatApi.Data;
using BoatApi.Dtos;
using BoatApi.Models;
using BoatApi.Repositories;
using BoatApi.Services;
using BoatAppApi.Config;
using BoatAppApi.Middleware;
using BoatAppApi.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
#pragma warning restore SA1200 // Using directives should be placed correctly

var builder = WebApplication.CreateBuilder(args);

// Add configuration files
builder.Configuration.AddJsonFile("appsettings.json");

// Use secrets.json on dev environment
if (builder.Environment.IsDevelopment())
{
    builder.Configuration.AddUserSecrets<Program>();
}

// Add logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

builder.Services.AddLogging(logging =>
{
    logging.ClearProviders();
    logging.AddConfiguration(builder.Configuration.GetSection("Logging"));
    logging.AddConsole();
    logging.AddDebug();
});

// Configure data services
builder.Services.AddDbContext<BoatApiDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddIdentity<BoatApiUser, IdentityRole>()
    .AddEntityFrameworkStores<BoatApiDbContext>()
    .AddDefaultTokenProviders();

// AutoMapper dependency injection
// Add Mapper config:
var mapperConfig = new MapperConfiguration(cfg =>
{
    cfg.CreateMap<Boat, BoatDto>();
    cfg.CreateMap<CreateBoatDto, Boat>()
        .BeforeMap((src, dest) =>
        {
            if (string.IsNullOrEmpty(src.Name) || string.IsNullOrEmpty(src.Description))
            {
                throw new ArgumentException("Name and description are required.");
            }
        })
        .ForMember(dest => dest.Id, opt => opt.MapFrom(src => Guid.NewGuid()))
        .IgnoreAllPropertiesWithAnInaccessibleSetter(); ;
    cfg.CreateMap<UpdateBoatDto, Boat>()
        .BeforeMap((src, dest) =>
        {
            if (string.IsNullOrEmpty(src.Name) || string.IsNullOrEmpty(src.Description))
            {
                throw new ArgumentException("Name and description are required.");
            }
        });
});
builder.Services.AddSingleton(mapperConfig.CreateMapper());

// Add JWT authentication
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));
var jwtSettings = builder.Configuration.GetSection("Jwt").Get<JwtSettings>();

// JwtSettings dependency injection
builder.Services.AddSingleton(jwtSettings);

var key = Encoding.ASCII.GetBytes(jwtSettings.Secret);
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultSignInScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultSignOutScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false,
        ClockSkew = TimeSpan.FromSeconds(30), // Allow for a small time difference between server and client machines
    };
});

// Services
builder.Services.AddScoped<IBoatService, BoatService>();
builder.Services.AddScoped<IBoatRepository, BoatRepository>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IApiUserService, ApiUserService>();

// Add MemoryCache service
builder.Services.AddMemoryCache();

// Swagger services
// Add SwaggerGen
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "BoatAppApi", Version = "v1" });

    // Add JWT Authentication
    var securityScheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        BearerFormat = "JWT",
        Description = "JWT Authorization header using the Bearer scheme.",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" },
    };
    c.AddSecurityDefinition("Bearer", securityScheme);

    // Make sure Swagger UI requires a Bearer token to be specified
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            securityScheme,
            Array.Empty<string>()
        },
    });
});

// Controllers and endpoints
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

// Swagger middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Use HTTPS redirection
app.UseHttpsRedirection();

// Check if the Jwt is still valid
app.UseMiddleware<JwtAuthenticationMiddleware>();

// Use authentication and authorization
app.UseAuthentication();
app.UseAuthorization();

// Map controllers
app.MapControllers();

// Run application
app.Run();
