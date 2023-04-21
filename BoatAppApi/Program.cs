using AutoMapper;
using BoatApi.Data;
using BoatApi.Dtos;
using BoatApi.Models;
using BoatApi.Repositories;
using BoatApi.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

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
    cfg.CreateMap<CreateBoatDto, Boat>();
    cfg.CreateMap<UpdateBoatDto, Boat>();
});
builder.Services.AddSingleton(mapperConfig.CreateMapper());

// Services
builder.Services.AddScoped<IBoatService, BoatService>();
builder.Services.AddScoped<IBoatRepository, BoatRepository>();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
