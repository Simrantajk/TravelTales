// using System;
// using System.Collections.Generic;
// using System.Linq;
// using System.IdentityModel.Tokens.Jwt;
// using dotnetapp.Data;
// using Microsoft.AspNetCore.Identity;      
// using Microsoft.Extensions.Configuration; 
// using System.Security.Claims;             
// using Microsoft.IdentityModel.Tokens;     
// using System.Text;                       
// using System.IdentityModel.Tokens.Jwt;    
// using dotnetapp.Models;


// namespace dotnetapp.Services
// {
//     public class AuthService : IAuthService
//     {
//         private readonly UserManager<ApplicationUser> userManager;
//         private readonly RoleManager<IdentityRole> roleManager;
//         private readonly IConfiguration _configuration;
//         private readonly ApplicationDbContext _context;

//         public AuthService(UserManager<ApplicationUser> userManager,
//                            RoleManager<IdentityRole> roleManager,
//                            IConfiguration configuration,
//                            ApplicationDbContext context)
//         {
//             this.userManager = userManager;
//             this.roleManager = roleManager;
//             _configuration = configuration;
//             _context = context;
//         }

//         public async Task<(int, string)> Registration(User model, string role)
//         {
//             // check email exists
//             var existing = await userManager.FindByEmailAsync(model.Email);
//             if (existing != null)
//                 return (400, "User already exists");

//             var user = new ApplicationUser
//             {
//                 UserName = model.Email,
//                 Email = model.Email,
//                 PhoneNumber = model.MobileNumber,
//                 Name = model.Username
//             };

//             var result = await userManager.CreateAsync(user, model.Password);
//             if (!result.Succeeded)
//             {
//                 var errors = string.Join("; ", result.Errors.Select(e => e.Description));
//                 return (500, $"User creation failed! {errors}");
//             }

//             // Ensure role exists
//             if (!await roleManager.RoleExistsAsync(role))
//             {
//                 await roleManager.CreateAsync(new IdentityRole(role));
//             }

//             var roleResult = await userManager.AddToRoleAsync(user, role);
//             if (!roleResult.Succeeded)
//             {
//                 var errors = string.Join("; ", roleResult.Errors.Select(e => e.Description));
//                 return (500, $"User creation failed! Role assignment error: {errors}");
//             }

//             return (201, "User created successfully!");
//         }

//    public async Task<(int, object)> Login(LoginModel model)
// {
//     var user = await userManager.FindByEmailAsync(model.Email);
//     if (user == null)
//         return (400, "Invalid email");

//     if (!await userManager.CheckPasswordAsync(user, model.Password))
//         return (400, "Invalid password");

//     var userRoles = await userManager.GetRolesAsync(user);

//     var authClaims = new[]
//     {
//         new Claim(ClaimTypes.Name, user.UserName ?? string.Empty),
//         new Claim(ClaimTypes.NameIdentifier, user.Id),
//         new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
//     }.ToList();

//     foreach (var role in userRoles)
//     {
//         authClaims.Add(new Claim(ClaimTypes.Role, role));
//     }

//     var token = GenerateToken(authClaims);

//     // If you want a single role string (e.g., the first/primary role)
//     var userRole = userRoles?.FirstOrDefault();

//     // Return a consistent, frontend-friendly shape
//     return (201, new
//     {
//         status = "Success",
//         token,
//         userRole,              // e.g., "Guide"
//         username = user.UserName, // or user.Name if you prefer the full name
//         roles = userRoles      // keep the full list as well (optional)
//     });
// }

//         private string GenerateToken(System.Collections.Generic.IEnumerable<Claim> claims)
//         {
//             var secret = _configuration["JWT:Secret"];
//             var issuer = _configuration["JWT:ValidIssuer"];
//             var audience = _configuration["JWT:ValidAudience"];
//             if (string.IsNullOrWhiteSpace(secret))
//                 throw new InvalidOperationException("JWT:Secret is not configured.");

//             var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));

//             var token = new JwtSecurityToken(
//                 issuer: issuer,
//                 audience: audience,
//                 expires: DateTime.UtcNow.AddHours(6),
//                 claims: claims,
//                 signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
//             );

//             return new JwtSecurityTokenHandler().WriteToken(token);
//         }
//     }
// }

using System;
using System.Collections.Generic;
using System.Linq;
using System.IdentityModel.Tokens.Jwt;
using dotnetapp.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration; 
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using dotnetapp.Models;
using Microsoft.Extensions.Logging; 

namespace dotnetapp.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;
        private readonly ILogger<AuthService> _logger; 

        public AuthService(UserManager<ApplicationUser> userManager,
                           RoleManager<IdentityRole> roleManager,
                           IConfiguration configuration,
                           ApplicationDbContext context,
                           ILogger<AuthService> logger) 
        {
            this.userManager = userManager;
            this.roleManager = roleManager;
            _configuration = configuration;
            _context = context;
            _logger = logger; 
        }

        public async Task<(int, string)> Registration(User model, string role)
        {
            _logger.LogInformation("Attempting new user registration for email: {Email}", model.Email); 
            
            // check email exists
            var existing = await userManager.FindByEmailAsync(model.Email);
            if (existing != null)
            {
                _logger.LogWarning("Registration failed: User already exists with email {Email}.", model.Email); 
                return (400, "User already exists");
            }

            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                PhoneNumber = model.MobileNumber,
                Name = model.Username
            };

            var result = await userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
            {
                var errors = string.Join("; ", result.Errors.Select(e => e.Description));
                _logger.LogError("User creation failed for email {Email}. Errors: {Errors}", model.Email, errors); 
                return (500, $"User creation failed! {errors}");
            }

            // Ensure role exists
            if (!await roleManager.RoleExistsAsync(role))
            {
                _logger.LogWarning("Attempting to create missing role: {Role}", role); 
                await roleManager.CreateAsync(new IdentityRole(role));
            }

            var roleResult = await userManager.AddToRoleAsync(user, role);
            if (!roleResult.Succeeded)
            {
                var errors = string.Join("; ", roleResult.Errors.Select(e => e.Description));
                _logger.LogError("Role assignment failed for user {Email} with role {Role}. Errors: {Errors}", model.Email, role, errors); 
                return (500, $"User creation failed! Role assignment error: {errors}");
            }

            _logger.LogInformation("New user successfully registered: {Email} with role {Role}.", model.Email, role); 
            return (201, "User created successfully!");
        }

        public async Task<(int, object)> Login(LoginModel model)
        {
            _logger.LogInformation("Login attempt for email: {Email}", model.Email); 
            
            var user = await userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                _logger.LogWarning("Login failed: User not found for email {Email}.", model.Email); 
                return (400, "Invalid email");
            }

            if (!await userManager.CheckPasswordAsync(user, model.Password))
            {
                _logger.LogWarning("Login failed: Invalid password for user {Email}.", model.Email); 
                return (400, "Invalid password");
            }

            var userRoles = await userManager.GetRolesAsync(user);

            var authClaims = new[]
            {
                new Claim(ClaimTypes.Name, user.UserName ?? string.Empty),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            }.ToList();

            foreach (var role in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, role));
            }

            var token = GenerateToken(authClaims);

            var userRole = userRoles?.FirstOrDefault();
            
            _logger.LogInformation("User {Email} logged in successfully with role {Role}.", model.Email, userRole); 

            return (201, new
            {
                status = "Success",
                token,
                userRole,
                username = user.UserName,
                roles = userRoles
            });
        }

        private string GenerateToken(System.Collections.Generic.IEnumerable<Claim> claims)
        {
            var secret = _configuration["JWT:Secret"];
            var issuer = _configuration["JWT:ValidIssuer"];
            var audience = _configuration["JWT:ValidAudience"];
            if (string.IsNullOrWhiteSpace(secret))
                throw new InvalidOperationException("JWT:Secret is not configured.");

            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                expires: DateTime.UtcNow.AddHours(6),
                claims: claims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
