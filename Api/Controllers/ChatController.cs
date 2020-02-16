using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Api.Services;
using Api.Models;
using Api.Security;

namespace Api.Controllers
{
    [Route("auth")]
    public class ChatController : Controller
    {
        private readonly IChatService _chatService;
        private readonly IUserAppContext _userAppContext;
        public ChatController(IChatService chatService,IUserAppContext userAppContext)
        {
            _userAppContext = userAppContext;
            _chatService = chatService;
        }

        /// <summary>
        /// Get Recent Chats
        /// </summary>
        /// <remarks>
        /// Get Recent Chats
        /// </remarks>
        /// <param name="command">CreateUser Model</param>
        /// <response code="201">Successful. Redirects to home page with successful message</response>
        /// <response code="400">BadRequest. User input model is invalid or Email is already registered</response>   
        [ProducesResponseType((int)HttpStatusCode.Created)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [HttpPost("getRecentChats")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> GetRecentChats()
        {
            try
            {
                var userId = _userAppContext.CurrentUserId;
                var result = await _chatService.GetRecentChatsByUser(userId);
                return Ok(result);
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
    }
}
