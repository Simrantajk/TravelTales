// using System;
// using System.Collections.Generic;
// using System.Linq;
// using System.Runtime.Versioning;
// using System.Threading.Tasks;
// using dotnetapp.Services;
// using dotnetapp.Models;
// using Microsoft.AspNetCore.Mvc;           
// using Microsoft.AspNetCore.Authorization; 
// using Microsoft.AspNetCore.Cors;      

// namespace dotnetapp.Controllers
// {
//     [ApiController]
//     [Route("api")]
//     [EnableCors("AllowFrontend")]
//     public class AuthenticationController : ControllerBase
//     {
//         private readonly IAuthService _authService;

//         public AuthenticationController(IAuthService authService)
//         {
//             _authService = authService;
//         }

//         [HttpPost("register")]
//         public async Task<IActionResult> Register([FromBody] User model)
//         {
//             if (!ModelState.IsValid) return BadRequest(ModelState);

//             try
//             {
//                 var (statusCode, message) = await _authService.Registration(model, model.UserRole);
//                 if (statusCode == 201)
//                     return Created("", new { Status = "Success", Message = message });

//                 return StatusCode(statusCode, new { Status = "Failed", Message = message });
//             }
//             catch (System.Exception ex)
//             {
//                 return StatusCode(500, new { Status = "Error", Message = ex.Message });
//             }
//         }

//         [HttpPost("login")]
//         public async Task<IActionResult> Login([FromBody] LoginModel model)
//         {
//             if (!ModelState.IsValid) return BadRequest(ModelState);

//             try
//             {
//                 var (statusCode, resultObj) = await _authService.Login(model);
//                 if (statusCode == 201)
//                     return Created("", resultObj);

//                 return StatusCode(statusCode, new { Status = "Failed", Message = resultObj });
//             }
//             catch (System.Exception ex)
//             {
//                 return StatusCode(500, new { Status = "Error", Message = ex.Message });
//             }
//         }
//     }
// }

using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Versioning;
using System.Threading.Tasks;
using dotnetapp.Services;
using dotnetapp.Models;
using Microsoft.AspNetCore.Mvc;           
using Microsoft.AspNetCore.Authorization; 
using Microsoft.AspNetCore.Cors;      
using Microsoft.Extensions.Logging; 

namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api")]
    [EnableCors("AllowFrontend")]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthenticationController> _logger;

        public AuthenticationController(IAuthService authService, ILogger<AuthenticationController> logger) 
        {
            _authService = authService;
            _logger = logger; 
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                var (statusCode, message) = await _authService.Registration(model, model.UserRole);
                if (statusCode == 201)
                    return Created("", new { Status = "Success", Message = message });

                return StatusCode(statusCode, new { Status = "Failed", Message = message });
            }
            catch (System.Exception ex)
            {
                // ERROR LOG: Catching unhandled exception at controller level
                _logger.LogError(ex, "Unhandled exception during registration for user: {Email}", model.Email); 
                return StatusCode(500, new { Status = "Error", Message = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                var (statusCode, resultObj) = await _authService.Login(model);
                if (statusCode == 201)
                    return Created("", resultObj);

                return StatusCode(statusCode, new { Status = "Failed", Message = resultObj });
            }
            catch (System.Exception ex)
            {
                // ERROR LOG: Catching unhandled exception at controller level
                _logger.LogError(ex, "Unhandled exception during login for user: {Email}", model.Email); 
                return StatusCode(500, new { Status = "Error", Message = ex.Message });
            }
        }
    }
}
