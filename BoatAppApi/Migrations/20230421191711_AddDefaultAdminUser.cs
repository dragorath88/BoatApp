using BoatApi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BoatAppApi.Migrations
{
    public partial class AddDefaultAdminUser : Migration
    {
        private static readonly string _defaultAdminUserId = new Guid("00000000-0000-0000-0000-000000000001").ToString();

        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "UserName", "NormalizedUserName", "Email", "NormalizedEmail", "EmailConfirmed", "PasswordHash", "SecurityStamp", "ConcurrencyStamp", "PhoneNumber", "PhoneNumberConfirmed", "TwoFactorEnabled", "LockoutEnd", "LockoutEnabled", "AccessFailedCount", "IsAdmin" },
                values: new object[] {
                    _defaultAdminUserId,
                    "admin@boatapp.com", // Default username
                    "ADMIN@BOATAPP.COM",
                    "admin@boatapp.com", // Default Email
                    "ADMIN@BOATAPP.COM",
                    true,
                    new PasswordHasher<BoatApiUser>().HashPassword(null, "P@ssw0rd!"), // Default Password
                    string.Empty,
                    string.Empty,
                    null,
                    false,
                    false,
                    null,
                    false,
                    0,
                    true
                });
        }


        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: _defaultAdminUserId);
        }
    }
}
