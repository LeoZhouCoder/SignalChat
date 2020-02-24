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
        private readonly static ConnectionMapping<string> _connections = new ConnectionMapping<string>();
        public ChatHub(IChatService chatService)
        {
            _chatService = chatService;
        }
        private async Task SendResponseToCaller(ChatResponse msg)
        {
            await Clients.Caller.SendAsync("ReceiveResponse", msg);
        }
        private async Task SendResponseToUser(string user, ChatResponse msg)
        {
            await Clients.User(user).SendAsync("ReceiveResponse", msg);
        }
        private async Task SendResponseToGroup(string group, ChatResponse msg)
        {
            await Clients.Group(group).SendAsync("ReceiveResponse", msg);
        }
        private async Task SendResponseToAll(ChatResponse msg)
        {
            await Clients.All.SendAsync("ReceiveResponse", msg);
        }

        private async Task AddToGroup(string groupName, string connectionId)
        {
            await Groups.AddToGroupAsync(connectionId, groupName);
        }

        private async Task RemoveFromGroup(string groupName, string connectionId)
        {
            await Groups.RemoveFromGroupAsync(connectionId, groupName);
        }

        private async Task GroupUserConnection(string groupName, string user, bool isAdd = true)
        {
            var connections = _connections.GetConnections(user);
            foreach (string connection in connections)
            {
                if (isAdd)
                {
                    await AddToGroup(groupName, connection);
                }
                else
                {
                    await RemoveFromGroup(groupName, connection);
                }
            }
        }

        public override async Task OnConnectedAsync()
        {
            try
            {
                _connections.Add(Context.UserIdentifier, Context.ConnectionId);

                var result = await _chatService.GetGroupsAndRecords(Context.UserIdentifier);
                ChatResponse response = new ChatResponse();
                if (result.Success)
                {
                    response.Type = ChatResponseType.UpdateChatrooms;
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
                        await AddToGroup(group, Context.ConnectionId);
                    }
                }
                // Get All Users
                result = await _chatService.GetAllUsers();
                await SendResponseToAll(new ChatResponse()
                {
                    Type = ChatResponseType.UpdateOnlineUsers,
                    Data = new
                    {
                        OnlineUsers = _connections.Keys,
                        AllUsers = result.Data
                    }
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
                _connections.Remove(Context.UserIdentifier, Context.ConnectionId);

                await SendResponseToAll(new ChatResponse()
                {
                    Type = ChatResponseType.UpdateOnlineUsers,
                    Data = _connections.Keys
                });

                // Remove from hub groups
                var result = await _chatService.GetUserGroups(Context.UserIdentifier);
                if (result.Success)
                {
                    var groups = (List<string>)result.Data;
                    foreach (string group in groups)
                    {
                        await RemoveFromGroup(group, Context.ConnectionId);
                    }
                }

                await base.OnDisconnectedAsync(exception);
            }
            catch (Exception ex)
            {

            }
        }

        public async Task SendMessage(MessageRequest request)
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
                }
                else
                {
                    await SendResponseToGroup(request.Group, new ChatResponse
                    {
                        Type = ChatResponseType.AddChat,
                        Data = result.Data
                    });
                }
            }
            catch (Exception ex)
            {

            }
        }

        public async Task GetChats(GetGroupChatsRequest request)
        {
            try
            {
                var result = await _chatService.GetChatsByGroupId(request.Group, request.Position, request.Limit);
                ChatResponse response = new ChatResponse();
                if (result.Success)
                {
                    response.Type = ChatResponseType.UpdateChats;
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
            catch (Exception ex)
            {

            }
        }

        public async Task CreateGroup(CreateGroupRequest request)
        {
            try
            {
                var result = await _chatService.CreateGroup(request.Name, request.Users);
                ChatResponse response = new ChatResponse();
                if (result.Success)
                {
                    var group = (GroupView)result.Data;
                    foreach (string user in group.Users)
                    {
                        await GroupUserConnection(group.Id, user, true);
                    }

                    response.Type = ChatResponseType.UpdateGroup;
                    response.Data = result.Data;
                    await SendResponseToGroup(group.Id, response);
                }
                else
                {
                    response.Type = ChatResponseType.SystemErrorMessage;
                    response.Data = result.Message;
                    await SendResponseToCaller(response);
                }
            }
            catch (Exception ex)
            {

            }
        }

        public async Task UpdateGroup(UpdateGroupRequest request)
        {
            try
            {
                var result = await _chatService.UpdateGroup(Context.UserIdentifier, request.Group, request.Name, request.Users);
                ChatResponse response = new ChatResponse();
                if (result.Success)
                {
                    UpdateGroupResponse updateGroupResponse = (UpdateGroupResponse)result.Data;
                    response.Type = ChatResponseType.UpdateGroupView;
                    response.Data = updateGroupResponse.Group;
                    await SendResponseToGroup(request.Group, response);

                    response = new ChatResponse();
                    response.Type = ChatResponseType.DeleteGroup;
                    response.Data = request.Group;

                    foreach (string user in updateGroupResponse.DeletedUsers)
                    {
                        await SendResponseToUser(user, response);
                        await GroupUserConnection(request.Group, user, false);
                    }
                }
                else
                {
                    response.Type = ChatResponseType.SystemErrorMessage;
                    response.Data = result.Message;
                    await SendResponseToCaller(response);
                }
            }
            catch (Exception ex)
            {

            }
        }

        public async Task AddUserToGroup(GroupUserRequest request)
        {
            try
            {
                var result = await _chatService.AddUserToGroup(Context.UserIdentifier, request.Group, request.User);
                ChatResponse response = new ChatResponse();
                if (result.Success)
                {
                    response.Type = ChatResponseType.UpdateGroupView;
                    response.Data = result.Data;
                    await SendResponseToGroup(request.Group, response);
                    await GroupUserConnection(request.Group, request.User, true);
                }
                else
                {
                    response.Type = ChatResponseType.SystemErrorMessage;
                    response.Data = result.Message;
                    await SendResponseToCaller(response);
                }
            }
            catch (Exception ex)
            {

            }
        }

        public async Task RemoveUserFromGroup(GroupUserRequest request)
        {
            try
            {
                var result = await _chatService.RemoveUserFromGroup(Context.UserIdentifier, request.Group, request.User);
                ChatResponse response = new ChatResponse();
                if (result.Success)
                {
                    response.Type = ChatResponseType.UpdateGroupView;
                    response.Data = result.Data;
                    await SendResponseToGroup(request.Group, response);
                    await GroupUserConnection(request.Group, request.User, false);
                }
                else
                {
                    response.Type = ChatResponseType.SystemErrorMessage;
                    response.Data = result.Message;
                    await SendResponseToCaller(response);
                }
            }
            catch (Exception ex)
            {

            }
        }

        public async Task DeleteGroup(string group)
        {
            try
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
            catch (Exception ex)
            {

            }
        }

        public async Task GetUserProfile(List<string> userIds)
        {
            try
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
            catch (Exception ex)
            {

            }
        }
    }
}