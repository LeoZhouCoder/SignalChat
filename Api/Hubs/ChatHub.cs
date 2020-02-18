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

            // Add users to hub groups
            result = await _chatService.GetUserGroups(Context.UserIdentifier);
            if (result.Success)
            {
                var groups = (List<string>)result.Data;
                foreach (string group in groups)
                {
                    AddToGroup(group, Context.UserIdentifier);
                }
            }

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

            // Remove from hub groups
            result = await _chatService.GetUserGroups(Context.UserIdentifier);
            if (result.Success)
            {
                var groups = (List<string>)result.Data;
                foreach (string group in groups)
                {
                    RemoveFromGroup(group, Context.UserIdentifier);
                }
            }

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
                    case ChatRequestType.GetGroupChats:
                        GetGroupChats((GetGroupChatsRequest)request.Data);
                        break;
                    case ChatRequestType.GetUserChats:
                        GetUserChats((GetUserChatsRequest)request.Data);
                        break;
                    case ChatRequestType.CreateGroup:
                        CreateGroup((CreateGroupRequest)request.Data);
                        break;
                    case ChatRequestType.ChangeGroupName:
                        ChangeGroupName((ChangeGroupNameRequest)request.Data);
                        break;
                    case ChatRequestType.AddUserToGroup:
                        AddUserToGroup((GroupUserRequest)request.Data);
                        break;
                    case ChatRequestType.RemoveUserFromGroup:
                        RemoveUserFromGroup((GroupUserRequest)request.Data);
                        break;
                    case ChatRequestType.DeleteGroup:
                        DeleteGroup((string)request.Data);
                        break;
                    case ChatRequestType.AddFriend:
                        AddFriend((string)request.Data);
                        break;
                    case ChatRequestType.DeleteFriend:
                        DeleteFriend((string)request.Data);
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
            if (request.Group != null)
            {
                await SendResponseToGroup(request.Group, new ChatResponse
                {
                    Type = ChatResponseType.ChatMessage,
                    Data = result.Data
                });
            }
            else
            {
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
        }

        private async void GetGroupChats(GetGroupChatsRequest request)
        {
            var result = await _chatService.GetChatsByGroupId(request.Group, request.Position, request.Limit);
            ChatResponse response = new ChatResponse();
            if (result.Success)
            {
                response.Type = ChatResponseType.UpdateGroupChats;
                response.Data = new
                {
                    Group = request.Group,
                    Chats = result.Data
                };
            }
            else
            {
                response.Type = ChatResponseType.SystemErrorMessage;
                response.Data = result.Message;
            }
            // TODO: Update read last chat
            await SendResponseToCaller(response);
        }

        private async void GetUserChats(GetUserChatsRequest request)
        {
            var result = await _chatService.GetChatsByUsers(Context.UserIdentifier, request.User, request.Position, request.Limit);
            ChatResponse response = new ChatResponse();
            if (result.Success)
            {
                response.Type = ChatResponseType.UpdateUserChats;
                response.Data = new
                {
                    User = request.User,
                    Chats = result.Data
                };
            }
            else
            {
                response.Type = ChatResponseType.SystemErrorMessage;
                response.Data = result.Message;
            }
            // TODO: Update read last chat
            await SendResponseToCaller(response);
        }

        private async void CreateGroup(CreateGroupRequest request)
        {
            var result = await _chatService.CreateGroup(request.Name, request.Users);
            ChatResponse response = new ChatResponse();
            if (result.Success)
            {
                var group = (GroupView)response.Data;

                response.Type = ChatResponseType.UpdateGroup;
                response.Data = result.Data;
                await SendResponseToGroup(group.Id, response);

                // Add users to hub group
                foreach (string user in group.Users)
                {
                    var temResult = await _chatService.GetUserConnectionIds(user);

                    if (temResult.Success)
                    {
                        var connectionIds = (List<string>)temResult.Data;
                        foreach (string connectionId in connectionIds)
                        {
                            AddToGroup(group.Id, connectionId);
                        }
                    }
                }
            }
            else
            {
                response.Type = ChatResponseType.SystemErrorMessage;
                response.Data = result.Message;
                await SendResponseToCaller(response);
            }
        }

        private async void ChangeGroupName(ChangeGroupNameRequest request)
        {
            var result = await _chatService.ChangeGroupName(Context.UserIdentifier, request.Group, request.Name);
            ChatResponse response = new ChatResponse();
            if (result.Success)
            {
                response.Type = ChatResponseType.UpdateGroup;
                response.Data = result.Data;
                await SendResponseToGroup(((GroupView)response.Data).Id, response);
            }
            else
            {
                response.Type = ChatResponseType.SystemErrorMessage;
                response.Data = result.Message;
                await SendResponseToCaller(response);
            }
        }

        private async void AddUserToGroup(GroupUserRequest request)
        {
            var result = await _chatService.AddUserToGroup(Context.UserIdentifier, request.Group, request.User);
            ChatResponse response = new ChatResponse();
            if (result.Success)
            {
                response.Type = ChatResponseType.UpdateGroup;
                response.Data = result.Data;
                await SendResponseToGroup(((GroupView)response.Data).Id, response);

                // Add users to hub group
                result = await _chatService.GetUserConnectionIds(request.User);
                if (result.Success)
                {
                    var connectionIds = (List<string>)result.Data;
                    foreach (string connectionId in connectionIds)
                    {
                        AddToGroup(request.Group, connectionId);
                    }
                }
            }
            else
            {
                response.Type = ChatResponseType.SystemErrorMessage;
                response.Data = result.Message;
                await SendResponseToCaller(response);
            }
        }

        private async void RemoveUserFromGroup(GroupUserRequest request)
        {
            var result = await _chatService.RemoveUserFromGroup(Context.UserIdentifier, request.Group, request.User);
            ChatResponse response = new ChatResponse();
            if (result.Success)
            {
                response.Type = ChatResponseType.UpdateGroup;
                response.Data = result.Data;
                await SendResponseToGroup(((GroupView)response.Data).Id, response);

                // Remove users from hub group
                result = await _chatService.GetUserConnectionIds(request.User);
                if (result.Success)
                {
                    var connectionIds = (List<string>)result.Data;
                    foreach (string connectionId in connectionIds)
                    {
                        RemoveFromGroup(request.Group, connectionId);
                    }
                }
            }
            else
            {
                response.Type = ChatResponseType.SystemErrorMessage;
                response.Data = result.Message;
                await SendResponseToCaller(response);
            }
        }

        private async void DeleteGroup(string group)
        {
            var result = await _chatService.DeleteGroup(Context.UserIdentifier, group);
            ChatResponse response = new ChatResponse();
            if (result.Success)
            {
                response.Type = ChatResponseType.DeleteGroup;
                response.Data = group;
                // TODO: Remove users from hub group ?????
                await SendResponseToGroup(group, response);
            }
            else
            {
                response.Type = ChatResponseType.SystemErrorMessage;
                response.Data = result.Message;
                await SendResponseToCaller(response);
            }
        }

        private async void AddFriend(string friend)
        {
            var result = await _chatService.AddFriend(Context.UserIdentifier, friend);
            ChatResponse response = new ChatResponse();
            if (result.Success)
            {
                response.Type = ChatResponseType.AddFriend;
                response.Data = friend;
                await SendResponseToCaller(response);

                response = new ChatResponse();
                response.Type = ChatResponseType.AddFriend;
                response.Data = Context.UserIdentifier;
                await SendResponseToUser(friend, response);
            }
            else
            {
                response.Type = ChatResponseType.SystemErrorMessage;
                response.Data = result.Message;
                await SendResponseToCaller(response);
            }
        }

        private async void DeleteFriend(string friend)
        {
            var result = await _chatService.DeleteFriend(Context.UserIdentifier, friend);
            ChatResponse response = new ChatResponse();
            if (result.Success)
            {
                response.Type = ChatResponseType.DeleteFriend;
                response.Data = friend;
                await SendResponseToCaller(response);

                response = new ChatResponse();
                response.Type = ChatResponseType.DeleteFriend;
                response.Data = Context.UserIdentifier;
                await SendResponseToUser(friend, response);
            }
            else
            {
                response.Type = ChatResponseType.SystemErrorMessage;
                response.Data = result.Message;
                await SendResponseToCaller(response);
            }
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

        private void AddToGroup(string groupName, string connectionId)
        {
            Groups.AddToGroupAsync(connectionId, groupName);
        }

        private void RemoveFromGroup(string groupName, string connectionId)
        {
            Groups.RemoveFromGroupAsync(connectionId, groupName);
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