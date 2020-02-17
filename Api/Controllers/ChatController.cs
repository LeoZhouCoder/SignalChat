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
    [Route("chat")]
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
        [HttpGet("getRecentChats")]
        [Authorize]
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
            catch (Exception e)
            {
                return BadRequest(new { Message = "Please contact the IT Department for futher information."+e.Message });
            }
        }
    }
}
