using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using System.Collections.Generic;
using System;
using Api.Services;
using Api.Models;

namespace SignalRChat.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly IChatService _chatService;
        public ChatHub(IChatService chatService)
        {
            _chatService = chatService;
        }
        private Task SendResponseToCaller(ChatResponse msg)
        {
            return Clients.Caller.SendAsync("ReceiveResponse", msg);
        }
        private Task SendResponseToUser(string user, ChatResponse msg)
        {
            return Clients.User(user).SendAsync("ReceiveResponse", msg);
        }
        private Task SendResponseToGroup(string group, ChatResponse msg)
        {
            return Clients.Group(group).SendAsync("ReceiveResponse", msg);
        }
        private Task SendResponseToAll(ChatResponse msg)
        {
            return Clients.All.SendAsync("ReceiveResponse", msg);
        }

        public override async Task OnConnectedAsync()
        {
            await _chatService.AddUserToOnlineList(Context.UserIdentifier, Context.ConnectionId);

            var result = await _chatService.GetRecentChatsByUser(Context.UserIdentifier);
            ChatResponse response = new ChatResponse();
            if (result.Success)
            {
                response.Type = ChatResponseType.UpdateRecentChatRecord;
                response.Data = result.Data;
            }
            else
            {
                response.Type = ChatResponseType.SystemErrorMessage;
                response.Data = result.Message;
            }
            await SendResponseToCaller(response);

            result = await _chatService.GetOnlineUsers();

            if (result.Success) await SendResponseToAll(new ChatResponse()
            {
                Type = ChatResponseType.UpdateOnlineUsers,
                Data = result.Data
            });
            await base.OnConnectedAsync();
        }
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await _chatService.RemoveUserFromOnlineList(Context.UserIdentifier, Context.ConnectionId);
            var result = await _chatService.GetOnlineUsers();
            if (result.Success) await SendResponseToAll(new ChatResponse()
            {
                Type = ChatResponseType.UpdateOnlineUsers,
                Data = result.Data
            });
            await base.OnDisconnectedAsync(exception);
        }

        public void AddChatRequest(ChatRequest request)
        {
            try
            {
                switch (request.Type)
                {
                    case ChatRequestType.Message:
                        SendMessage((MessageRequest)request.Data);
                        break;
                    case ChatRequestType.GetUserProfile:
                        GetUserProfile((List<string>)request.Data);
                        break;
                    default:
                        SendResponseToCaller(new ChatResponse
                        {
                            Type = ChatResponseType.SystemErrorMessage,
                            Data = "Invalid ChatRequestType: " + request.Type
                        });
                        break;
                }
            }
            catch (Exception e)
            {
                SendResponseToCaller(new ChatResponse
                {
                    Type = ChatResponseType.SystemErrorMessage,
                    Data = "Excute ChatRequest error: " + e.Message
                });
            }

        }

        private async void SendMessage(MessageRequest request)
        {
            var result = await _chatService.AddChat(
                Context.UserIdentifier,
                request.Type,
                request.Content,
                request.Group,
                request.Receiver);

            if (!result.Success)
            {
                await SendResponseToCaller(new ChatResponse
                {
                    Type = ChatResponseType.SystemErrorMessage,
                    Data = result.Message
                });
                return;
            }

            await SendResponseToCaller(new ChatResponse
            {
                Type = ChatResponseType.ChatMessage,
                Data = result.Data
            });
            await SendResponseToUser(request.Receiver,
            new ChatResponse
            {
                Type = ChatResponseType.ChatMessage,
                Data = result.Data
            });
        }

        private async void GetUserProfile(List<string> userIds)
        {
            var result = await _chatService.GetUserProfile(userIds);
            ChatResponse response = new ChatResponse();
            if (result.Success)
            {
                response.Type = ChatResponseType.UpdateUserProfile;
                response.Data = result.Data;
            }
            else
            {
                response.Type = ChatResponseType.SystemErrorMessage;
                response.Data = result.Message;
            }
            await SendResponseToCaller(response);
        }



        /* Old API

        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message, DateTime.UtcNow);
        }

        public Task SendMessageToCaller(string message)
        {
            return Clients.Caller.SendAsync("ReceiveMessage", message);
        }

        public Task SendMessageToGroup(string gid, string message)
        {
            return Clients.Group(gid).SendAsync("ReceiveMessage", message);
        }

        public Task SendPrivateMessage(string user, string message)
        {
            return Clients.User(user).SendAsync("ReceiveMessage", message);
        }

        public async Task AddToGroup(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            await Clients.Group(groupName).SendAsync("Send", $"{Context.ConnectionId} has joined the group {groupName}.");
        }

        public async Task RemoveFromGroup(string groupName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);

            await Clients.Group(groupName).SendAsync("Send", $"{Context.ConnectionId} has left the group {groupName}.");
        }
        
        */
    }
}