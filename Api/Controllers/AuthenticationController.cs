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
        private readonly IChatService _chatService;
        public AuthenticationController(IAuthenticationService authenticationService, IChatService chatService)
        {
            _authenticationService = authenticationService;
            _chatService = chatService;
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

                // Add welcome chat
                await AddWelcomeChats(authenticatedToken.User.Id);

                return Ok(authenticatedToken);
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
        [ProducesResponseType(typeof(AuthenticationResult), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
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
        private string[] chats = new string[]
        {
            "Hi, I'm Leo. Thank you for using my SignalChat!",
            "This chat room's front-end is built with React, Redux and Semantic-UI. The Back-end is built with ASP.NET MVC and SignalR. The database is MongoDB. Currently, this demo is published on Azure free web server, so the max connect users at the same time is only 5.",
            "This project is still in development, I'll add more features in the further. You can watch me on <a href=\"https://github.com/LeoZhouCoder/SignalChat\" target=\"_blank\">Github</a> and get the newest process. ",
            "if you have any questions, you can send me a message here, or on <a href=\"https://www.linkedin.com/in/leo-zhou-coder\" target=\"_blank\">LinkedIn</a>.  Thank you very much and have fun."
        };
        private async Task<bool> AddWelcomeChats(string userId)
        {
            string admin = "5e4c448cbef07dff96f71f3c"; // Developer Test Account
            if (userId == admin) return false;
            List<string> users = new List<string>();
            users.Add(admin);
            users.Add(userId);
            var result = await _chatService.CreateGroup(null, users);
            if (!result.Success) return false;
            var group = (GroupView)result.Data;

            foreach (string chat in chats)
            {
                await _chatService.AddChat(admin, 0, chat, group.Id, userId);
            }
            return true;
        }
    }
}
