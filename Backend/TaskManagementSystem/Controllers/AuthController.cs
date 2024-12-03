using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManagementSystemData;
using TaskManagementSystemData.Entities;
using TaskManagementSystemService.Interfaces;

namespace TaskManagementSystem.Controllers
{
    public class AuthController : ControllerBase
    {
        private readonly ITokenService _tokenService;
        private readonly ApplicationDbContext _dbContext;

        public AuthController(ITokenService tokenService, ApplicationDbContext dbContext)
        {
            _tokenService = tokenService;
            _dbContext = dbContext;
        }

        [HttpPost("login")]
        public ActionResult<LoginResponse> Login([FromBody] UserDto user)
        {
            var dbUser = _dbContext.Users.FirstOrDefault(u => u.Username == user.Username);

            if (dbUser == null || dbUser.Password != user.Password)
                return Unauthorized("Invalid credentials");

            var token = _tokenService.GenerateToken(dbUser.Username);

            var response = new LoginResponse
            {
                Token = token
            };

            return Ok(response);
        }
    }

    public class LoginResponse
    {
        public string Token { get; set; }
    }
}
