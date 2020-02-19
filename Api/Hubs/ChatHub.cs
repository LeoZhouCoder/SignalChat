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
            try
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

                if (result.Success)
                {
                    await SendResponseToAll(new ChatResponse()
                    {
                        Type = ChatResponseType.UpdateOnlineUsers,
                        Data = result.Data
                    });
                }

                await SendResponseToAll(new ChatResponse()
                {
                    Type = ChatResponseType.SystemMessage,
                    Data = "User: " + Context.UserIdentifier + " Connected: " + Context.ConnectionId,
                });

                await base.OnConnectedAsync();
            }
            catch (Exception ex)
            {

            }
        }
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            try
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

                await SendResponseToAll(new ChatResponse()
                {
                    Type = ChatResponseType.SystemMessage,
                    Data = "User: " + Context.UserIdentifier + " Disconnected: " + Context.ConnectionId,
                });

                await base.OnDisconnectedAsync(exception);
            }
            catch (Exception ex)
            {

            }
        }

        public async void SendMessage(MessageRequest request)
        {
            try
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
            catch (Exception ex)
            {

            }
        }

        public async void GetGroupChats(GetGroupChatsRequest request)
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

        public async void GetUserChats(GetUserChatsRequest request)
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

        public async void CreateGroup(CreateGroupRequest request)
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

        public async void ChangeGroupName(ChangeGroupNameRequest request)
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

        public async void AddUserToGroup(GroupUserRequest request)
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

        public async void RemoveUserFromGroup(GroupUserRequest request)
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

        public async void DeleteGroup(string group)
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

        public async void AddFriend(string friend)
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

        public async void DeleteFriend(string friend)
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

        public async void GetUserProfile(List<string> userIds)
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
    }
}