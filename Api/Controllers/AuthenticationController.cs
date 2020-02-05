using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using Api.Commands;
using Api.Services;
using Api.Models;

namespace Api.Controllers
{
    [Route("auth")]
    public class AuthenticationController : Controller
    {
        private readonly IAuthenticationService _authenticationService;
        public AuthenticationController(IAuthenticationService authenticationService)
        {
            _authenticationService = authenticationService;
        }

        /// <summary>
        /// Create a new account
        /// </summary>
        /// <remarks>
        /// Creates an new account for user
        /// </remarks>
        /// <param name="command">CreateUser Model</param>
        /// <response code="201">Successful. Redirects to home page with successful message</response>
        /// <response code="400">BadRequest. User input model is invalid or Email is already registered</response>   
        [ProducesResponseType((int)HttpStatusCode.Created)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [HttpPost("signUp")]
        public async Task<IActionResult> SignUp([FromBody]CreateUser command)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new
                    {
                        Message = ModelState.Values.SelectMany(e => e.Errors.Select(m => m.ErrorMessage))
                    });
                }
                // Check if password and confirm password match
                if (command.Password != command.ConfirmPassword)
                {
                    return BadRequest(new { Message = "The password fields don't match, please try again." });
                }

                var authenticatedToken = await _authenticationService.SignUp(command);

                return Ok(new { Success = true, Token = authenticatedToken });
            }
            catch (ApplicationException e)
            {
                return BadRequest(new { e.Message });
            }
            catch (Exception)
            {
                return BadRequest(new { Message = "Please contact the IT Department for futher information" });
            }
        }

        /// <summary>
        /// Allows registered users to sign in 
        /// </summary>
        /// <remarks>
        /// Allows registered users to sign in by entering their existing username and password
        /// </remarks>
        /// <param name="command">LoginCommand Model</param>
        /// <response code="200">Successful. User's credentials are valid</response>
        /// <response code="400">BadRequest. User input model is invalid</response> 
        /// <response code="401">Unauthorized. User's credentials are invalid</response> 
        //[ProducesResponseType(typeof(AuthenticationResult), (int)HttpStatusCode.OK)]
        //[ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        //[ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [HttpPost("signIn")]
        public async Task<IActionResult> SignIn([FromBody]LoginCommand command)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { Message = ModelState.Values.SelectMany(e => e.Errors.Select(m => m.ErrorMessage)) });
                }
                return Ok(await _authenticationService.SignIn(command.Email, command.Password));
            }
            catch (ApplicationException e)
            {
                return BadRequest(new { e.Message });
            }
        }
    }
}
