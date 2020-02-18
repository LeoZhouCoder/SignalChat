using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.Contracts;
using Api.Models;

namespace Api.Services
{
    public class ChatService : IChatService
    {
        private IRepository<Group> _groupRepository;
        private IRepository<User> _userRepository;
        private IRepository<OnlineUser> _onlineUserRepository;
        private IRepository<GroupUser> _groupUserRepository;
        private IRepository<Chat> _chatRepository;
        private IRepository<UserRelation> _userRelationRepository;

        public ChatService(IRepository<Group> groupRepository,
                            IRepository<User> userRepository,
                            IRepository<OnlineUser> onlineUserRepository,
                            IRepository<GroupUser> groupUserRepository,
                            IRepository<Chat> chatRepository,
                            IRepository<UserRelation> userRelationRepository)
        {
            _groupRepository = groupRepository;
            _userRepository = userRepository;
            _onlineUserRepository = onlineUserRepository;
            _groupUserRepository = groupUserRepository;
            _chatRepository = chatRepository;
            _userRelationRepository = userRelationRepository;
        }

        private async Task<Boolean> IsUserExisted(string uid)
        {
            try
            {
                var user = (await _userRepository.Get(x => x.Id == uid)).FirstOrDefault();
                return user != null;
            }
            catch (Exception)
            {
                return false;
            }
        }

        /// <summary>
        /// Add User To Online List
        /// </summary>
        /// <param name="uid">"User Id"</param>
        /// <param name="connectionId">"connectionId"</param>
        public async Task<RequestResult> AddUserToOnlineList(string uid, string connectionId)
        {
            try
            {
                var user = (await _userRepository.Get(x => x.Id == uid)).FirstOrDefault();
                if (user == null)
                {
                    return new RequestResult
                    {
                        Success = false,
                        Message = "Can't find user.",
                    };
                }

                var onlineUser = (await _onlineUserRepository.Get(x => x.Uid == uid && x.ConnectionId == connectionId)).FirstOrDefault();
                if (onlineUser != null)
                {
                    onlineUser.IsDeleted = false;
                    onlineUser.ActiveTime = DateTime.UtcNow;
                    await _onlineUserRepository.Update(onlineUser);
                }
                else
                {
                    onlineUser = (await _onlineUserRepository.Get(x => x.Uid == uid && x.IsDeleted)).FirstOrDefault();
                    if (onlineUser != null)
                    {
                        onlineUser.IsDeleted = false;
                        onlineUser.ConnectionId = connectionId;
                        onlineUser.ActiveTime = DateTime.UtcNow;
                        await _onlineUserRepository.Update(onlineUser);
                    }
                    else
                    {
                        onlineUser = new OnlineUser()
                        {
                            Id = ObjectId.GenerateNewId().ToString(),
                            Uid = uid,
                            ConnectionId = connectionId,
                            ActiveTime = DateTime.UtcNow,
                            IsDeleted = false
                        };
                        await _onlineUserRepository.Add(onlineUser);
                    }
                }
                return new RequestResult
                {
                    Success = true,
                };
            }
            catch (Exception ex)
            {
                return new RequestResult
                {
                    Success = false,
                    Message = "AddUserToOnlineList error - " + ex.Message,
                };
            }
        }

        /// <summary>
        /// Remove User From OnlineList
        /// </summary>
        /// <param name="uid">"User Id"</param>
        /// <param name="connectionId">"connectionId"</param>
        public async Task<RequestResult> RemoveUserFromOnlineList(string uid, string connectionId)
        {
            try
            {
                var onlineUser = (await _onlineUserRepository.Get(x => x.Uid == uid && x.ConnectionId == connectionId)).FirstOrDefault();
                if (onlineUser != null)
                {
                    if (!onlineUser.IsDeleted)
                    {
                        onlineUser.IsDeleted = true;
                        await _onlineUserRepository.Update(onlineUser);
                    }
                }
                return new RequestResult
                {
                    Success = true,
                };
            }
            catch (Exception ex)
            {
                return new RequestResult
                {
                    Success = false,
                    Message = "RemoveUserFromOnlineList error - " + ex.Message,
                };
            }
        }

        /// <summary>
        /// Get OnlineUsers
        /// </summary>
        public async Task<RequestResult> GetOnlineUsers()
        {
            try
            {
                var onlineUsers = (await _onlineUserRepository.Get(x => !x.IsDeleted))
                .OrderByDescending(x => x.ActiveTime)
                .Select(x => x.Uid).Distinct().ToList();

                return new RequestResult
                {
                    Success = true,
                    Data = onlineUsers,
                };
            }
            catch (Exception ex)
            {
                return new RequestResult
                {
                    Success = false,
                    Message = "GetOnlineUsers error - " + ex.Message,
                };
            }
        }

        /// <summary>
        /// Create Group
        /// </summary>
        /// <param name="name">"Group Name"</param>
        /// <param name="users">"Group Users"</param>
        public async Task<RequestResult> CreateGroup(string name, List<string> users)
        {
            try
            {
                if (users.Count() < 2)
                {
                    return new RequestResult
                    {
                        Success = false,
                        Message = "One group need at least two members.",
                    };
                }
                List<string> errorUsers = new List<string>();
                foreach (string uid in users)
                {
                    if ((await IsUserExisted(uid))) continue;
                    errorUsers.Add(uid);
                }
                if (errorUsers.Count() > 0)
                {
                    return new RequestResult
                    {
                        Success = false,
                        Message = "Can't find user: " + errorUsers.ToString() + " when create group.",
                    };
                }

                var group = new Group()
                {
                    Id = ObjectId.GenerateNewId().ToString(),
                    Name = name,
                    IsDeleted = false
                };
                await _groupRepository.Add(group);

                // Add Users to Group
                foreach (string uid in users)
                {
                    var groupUser = new GroupUser()
                    {
                        Id = ObjectId.GenerateNewId().ToString(),
                        Gid = group.Id,
                        Uid = uid,
                        IsDeleted = false
                    };
                    await _groupUserRepository.Add(groupUser);
                }
                var groupView = new GroupView
                {
                    Id = group.Id,
                    Name = group.Name,
                    Users = users
                };
                return new RequestResult
                {
                    Success = true,
                    Data = groupView,
                };
            }
            catch (Exception ex)
            {
                return new RequestResult
                {
                    Success = false,
                    Message = "CreateGroup error - " + ex.Message,
                };
            }
        }

        /// <summary>
        /// Delete Group
        /// </summary>
        /// <param name="editor">"Editor ID"</param>
        /// <param name="gid">"Group ID"</param>
        public async Task<RequestResult> DeleteGroup(string editor, string gid)
        {
            try
            {
                var groupUser = (await _groupUserRepository.Get(x => x.Gid == gid && x.Uid == editor && !x.IsDeleted)).FirstOrDefault();
                if (groupUser == null || groupUser.IsDeleted)
                {
                    return new RequestResult
                    {
                        Success = false,
                        Message = "No authority.",
                    };
                }

                // delete group users
                var groupUsers = (await _groupUserRepository.Get(x => x.Gid == gid && !x.IsDeleted));
                foreach (var gUser in groupUsers)
                {
                    gUser.IsDeleted = true;
                    await _groupUserRepository.Update(gUser);
                }

                // delete group
                var group = (await _groupRepository.Get(x => x.Id == gid)).FirstOrDefault();
                if (group != null && !group.IsDeleted)
                {
                    group.IsDeleted = false;
                    await _groupRepository.Update(group);
                }

                return new RequestResult
                {
                    Success = true,
                };
            }
            catch (Exception ex)
            {
                return new RequestResult
                {
                    Success = false,
                    Message = "DeleteGroup error - " + ex.Message,
                };
            }
        }

        private async Task<List<string>> GetGroupUsers(string gid)
        {
            return (await _groupUserRepository.Get(x => x.Gid == gid && !x.IsDeleted)).Select(x => x.Uid).ToList();
        }

        /// <summary>
        /// Update Group Name
        /// </summary>
        /// <param name="editor">"Editor ID"</param>
        /// <param name="gid">"Group ID"</param>
        /// <param name="name">"Group Name"</param>
        public async Task<RequestResult> ChangeGroupName(string editor, string gid, string name)
        {
            try
            {
                var groupUser = (await _groupUserRepository.Get(x => x.Gid == gid && x.Uid == editor && !x.IsDeleted)).FirstOrDefault();
                if (groupUser == null || groupUser.IsDeleted)
                {
                    return new RequestResult
                    {
                        Success = false,
                        Message = "No authority.",
                    };
                }

                var group = (await _groupRepository.Get(x => x.Id == gid)).FirstOrDefault();
                if (group != null && !group.IsDeleted)
                {
                    group.Name = name;
                    await _groupRepository.Update(group);

                    var groupView = new GroupView
                    {
                        Id = group.Id,
                        Name = group.Name,
                        Users = (await GetGroupUsers(group.Id))
                    };

                    return new RequestResult { Success = true, Data = groupView };
                }
                else
                {
                    return new RequestResult
                    {
                        Success = false,
                        Message = "Group is not existing."
                    };
                }

            }
            catch (Exception ex)
            {
                return new RequestResult
                {
                    Success = false,
                    Message = "ChangeGroupName error - " + ex.Message,
                };
            }
        }

        /// <summary>
        /// Add User To Group
        /// </summary>
        /// <param name="editor">"Editor ID"</param>
        /// <param name="gid">"Group ID"</param>
        /// <param name="uid">"User ID"</param>
        public async Task<RequestResult> AddUserToGroup(string editor, string gid, string uid)
        {
            try
            {
                var groupUser = (await _groupUserRepository.Get(x => x.Gid == gid && x.Uid == editor && !x.IsDeleted)).FirstOrDefault();
                if (groupUser == null || groupUser.IsDeleted)
                {
                    return new RequestResult
                    {
                        Success = false,
                        Message = "No authority.",
                    };
                }

                var group = (await _groupRepository.Get(x => x.Id == gid)).FirstOrDefault();
                if (group == null || group.IsDeleted)
                {
                    return new RequestResult
                    {
                        Success = false,
                        Message = "Group is not existing."
                    };
                }

                if (!(await IsUserExisted(uid)))
                {
                    return new RequestResult
                    {
                        Success = false,
                        Message = "User is not existing."
                    };
                }

                groupUser = (await _groupUserRepository.Get(x => x.Gid == gid && x.Uid == uid)).FirstOrDefault();
                if (groupUser != null)
                {
                    if (groupUser.IsDeleted)
                    {
                        groupUser.IsDeleted = false;
                        await _groupUserRepository.Update(groupUser);
                    }
                }
                else
                {
                    groupUser = new GroupUser()
                    {
                        Id = ObjectId.GenerateNewId().ToString(),
                        Gid = gid,
                        Uid = uid,
                        IsDeleted = false
                    };
                    await _groupUserRepository.Add(groupUser);
                }

                var groupView = new GroupView
                {
                    Id = group.Id,
                    Name = group.Name,
                    Users = (await GetGroupUsers(group.Id))
                };

                return new RequestResult { Success = true, Data = groupView };
            }
            catch (Exception ex)
            {
                return new RequestResult
                {
                    Success = false,
                    Message = "AddUserToGroup error - " + ex.Message,
                };
            }
        }

        /// <summary>
        /// Remove User From Group
        /// </summary>
        /// <param name="editor">"Editor ID"</param>
        /// <param name="gid">"Group ID"</param>
        /// <param name="uid">"User ID"</param>
        public async Task<RequestResult> RemoveUserFromGroup(string editor, string gid, string uid)
        {
            try
            {
                var groupUser = (await _groupUserRepository.Get(x => x.Gid == gid && x.Uid == editor && !x.IsDeleted)).FirstOrDefault();
                if (groupUser == null || groupUser.IsDeleted)
                {
                    return new RequestResult
                    {
                        Success = false,
                        Message = "No authority.",
                    };
                }

                var group = (await _groupRepository.Get(x => x.Id == gid)).FirstOrDefault();
                if (group == null || group.IsDeleted)
                {
                    return new RequestResult
                    {
                        Success = false,
                        Message = "Group is not existing."
                    };
                }

                groupUser = (await _groupUserRepository.Get(x => x.Gid == gid && x.Uid == uid)).FirstOrDefault();
                if (groupUser != null)
                {
                    if (!groupUser.IsDeleted)
                    {
                        groupUser.IsDeleted = true;
                        await _groupUserRepository.Update(groupUser);
                    }
                }

                var groupView = new GroupView
                {
                    Id = group.Id,
                    Name = group.Name,
                    Users = (await GetGroupUsers(group.Id))
                };

                return new RequestResult { Success = true, Data = groupView };
            }
            catch (Exception ex)
            {
                return new RequestResult
                {
                    Success = false,
                    Message = "RemoveUserFromGroup error - " + ex.Message,
                };
            }
        }

        /// <summary>
        /// Add Chat
        /// </summary>
        /// <param name="sender">Sender User ID</param>
        /// <param name="type">Chat Type</param>
        /// <param name="content">Chat Content</param>
        /// <param name="gid">Group ID</param>
        /// <param name="Receiver">Receiver User ID</param>
        public async Task<RequestResult> AddChat(string sender, ChatType type, string content, string gid = null, string receiver = null)
        {
            try
            {
                var user = (await _userRepository.Get(x => x.Id == sender)).FirstOrDefault();
                if (user == null || user.IsDeleted)
                {
                    return new RequestResult
                    {
                        Success = false,
                        Message = "Sender is not existing."
                    };
                }

                if (string.IsNullOrWhiteSpace(content))
                {
                    return new RequestResult
                    {
                        Success = false,
                        Message = "Can't send empty message."
                    };
                }

                if (!Enum.IsDefined(typeof(ChatType), type))
                {
                    return new RequestResult
                    {
                        Success = false,
                        Message = "Unsupported message type."
                    };
                }

                if (gid != null)
                {
                    var group = (await _groupRepository.Get(x => x.Id == gid)).FirstOrDefault();
                    if (group == null || group.IsDeleted)
                    {
                        return new RequestResult
                        {
                            Success = false,
                            Message = "Group is not existing."
                        };
                    }
                }

                if (receiver != null)
                {
                    var userReceiver = (await _userRepository.Get(x => x.Id == receiver)).FirstOrDefault();
                    if (userReceiver == null || userReceiver.IsDeleted)
                    {
                        return new RequestResult
                        {
                            Success = false,
                            Message = "User is not existing."
                        };
                    }
                }


                var chat = new Chat()
                {
                    Id = ObjectId.GenerateNewId().ToString(),
                    Sender = sender,
                    Type = type,
                    Content = content,
                    Gid = gid,
                    Receiver = receiver,
                    CreatedOn = DateTime.UtcNow,
                    IsDeleted = false
                };
                await _chatRepository.Add(chat);
                return new RequestResult
                {
                    Success = true,
                    Data = chat,
                };
            }
            catch (Exception ex)
            {
                return new RequestResult
                {
                    Success = false,
                    Message = "AddChat error - " + ex.Message,
                };
            }
        }

        /// <summary>
        /// Delete Chat
        /// </summary>
        /// <param name="cid">"Chat ID"</param>
        public async Task<RequestResult> DeleteChat(string editor, string cid)
        {
            try
            {
                var chat = (await _chatRepository.Get(x => x.Id == cid)).FirstOrDefault();
                if (chat != null)
                {
                    if (!chat.IsDeleted)
                    {
                        if (chat.Sender != editor)
                        {
                            return new RequestResult
                            {
                                Success = false,
                                Message = "No authority.",
                            };
                        }
                        chat.IsDeleted = true;
                        await _chatRepository.Update(chat);
                    }
                }
                return new RequestResult { Success = true };
            }
            catch (Exception ex)
            {
                return new RequestResult
                {
                    Success = false,
                    Message = "DeleteChat error - " + ex.Message,
                };
            }
        }

        private async Task<RequestResult> AddRelation(string owner, string target, UserRelationType type = 0)
        {
            try
            {
                var relation = (await _userRelationRepository.Get(x => x.Owner == owner && x.Target == target)).FirstOrDefault();
                if (relation == null)
                {
                    relation = new UserRelation()
                    {
                        Id = ObjectId.GenerateNewId().ToString(),
                        Owner = owner,
                        Target = target,
                        Type = type,
                        IsDeleted = false
                    };
                    await _userRelationRepository.Add(relation);
                }
                else
                {
                    relation.IsDeleted = false;
                    relation.Type = type;
                    await _userRelationRepository.Update(relation);
                }
                return new RequestResult { Success = true };
            }
            catch (Exception ex)
            {
                return new RequestResult { Success = false, Message = "AddRelation error - " + ex.Message };
            }
        }

        /// <summary>
        /// Add Friend
        /// </summary>
        /// <param name="owner">Owner User ID</param>
        /// <param name="target">Target User ID</param>
        public async Task<RequestResult> AddFriend(string owner, string target)
        {
            var result = await AddRelation(owner, target, UserRelationType.Friend);
            if (!result.Success) return result;
            return await AddRelation(target, owner, UserRelationType.Friend);
        }

        /// <summary>
        /// Delete Relation
        /// </summary>
        /// <param name="owner">Owner User ID</param>
        /// <param name="target">Target User ID</param>
        private async Task<RequestResult> DeleteRelation(string owner, string target)
        {
            try
            {
                var relation = (await _userRelationRepository.Get(x => x.Owner == owner && x.Target == target)).FirstOrDefault();
                if (relation != null && !relation.IsDeleted)
                {
                    relation.IsDeleted = true;
                    await _userRelationRepository.Update(relation);
                }
                return new RequestResult { Success = true };
            }
            catch (Exception ex)
            {
                return new RequestResult { Success = false, Message = "DeleteRelation error - " + ex.Message };
            }
        }

        /// <summary>
        /// Delete Friend
        /// </summary>
        /// <param name="owner">Owner User ID</param>
        /// <param name="target">Target User ID</param>
        public async Task<RequestResult> DeleteFriend(string owner, string target)
        {
            var result = await DeleteRelation(owner, target);
            if (!result.Success) return result;
            return await DeleteRelation(target, owner);
        }

        /// <summary>
        /// Get Chats
        /// </summary>
        /// <param name="gid">Group ID</param>
        /// <param name="position">Start Position</param>
        /// <param name="limit">Chat Number</param>
        public async Task<RequestResult> GetChatsByGroupId(string gid, int position, int limit)
        {
            try
            {
                var chats = await _chatRepository.Get(x => x.Gid == gid && !x.IsDeleted);
                var returnChats = chats.OrderByDescending(x => x.CreatedOn).Skip(position).Take(limit);
                return new RequestResult { Success = true, Data = returnChats };
            }
            catch (Exception ex)
            {
                return new RequestResult { Success = false, Message = "GetChats error - " + ex.Message };
            }
        }

        /// <summary>
        /// Get Chats
        /// </summary>
        /// <param name="uid0">User A</param>
        /// <param name="uid1">User B</param>
        /// <param name="position">Start Position</param>
        /// <param name="limit">Chat Number</param>
        public async Task<RequestResult> GetChatsByUsers(string uid0, string uid1, int position, int limit)
        {
            try
            {
                var chats = await _chatRepository.Get(x => ((x.Sender == uid0 && x.Receiver == uid1) || (x.Sender == uid1 && x.Receiver == uid0)) && !x.IsDeleted);
                var returnChats = chats.OrderByDescending(x => x.CreatedOn).Skip(position).Take(limit);
                return new RequestResult { Success = true, Data = returnChats };
            }
            catch (Exception ex)
            {
                return new RequestResult { Success = false, Message = "GetChats error - " + ex.Message };
            }
        }

        /// <summary>
        /// Get Recent Chats By User
        /// </summary>
        /// <param name="uid">User ID</param>
        public async Task<RequestResult> GetRecentChatsByUser(string uid)
        {
            try
            {
                List<Chat> chats = new List<Chat>();
                List<GroupView> groups = new List<GroupView>();
                List<string> allUserIds = new List<string>();

                // Get Recent Group Chats
                var groupIds = (await _groupUserRepository.Get(x => x.Uid == uid && !x.IsDeleted)).Select(x => x.Gid).ToList();
                foreach (var gid in groupIds)
                {
                    var group = (await _groupRepository.Get(x => x.Id == gid && !x.IsDeleted)).FirstOrDefault();
                    var chat = (await _chatRepository.Get(x => x.Gid == gid && !x.IsDeleted)).FirstOrDefault();
                    if (chat != null) chats.Add(chat);
                    var userIds = (await _groupUserRepository.Get(x => x.Gid == gid && !x.IsDeleted)).Select(x => x.Uid).ToList();
                    var groupView = new GroupView
                    {
                        Id = group.Id,
                        Name = group.Name,
                        Users = userIds
                    };
                    groups.Add(groupView);

                    allUserIds = allUserIds.Union(userIds).ToList();
                }

                // Get Recent Friends' Chat
                var friends = (await _userRelationRepository.Get(x => x.Owner == uid)).Select(x => x.Target).ToList();
                foreach (var friend in friends)
                {
                    var chat = (await _chatRepository.Get(x => ((x.Sender == uid && x.Receiver == friend) || (x.Sender == friend && x.Receiver == uid)) && !x.IsDeleted)).FirstOrDefault();
                    if (chat != null) chats.Add(chat);
                }

                List<User> users = new List<User>();
                allUserIds = allUserIds.Union(friends).ToList();
                foreach (var id in allUserIds)
                {
                    var user = (await _userRepository.Get(x => x.Id == id && !x.IsDeleted)).FirstOrDefault();
                    if (user != null) users.Add(user);
                }

                var data = new
                {
                    chats,
                    groups,
                    users
                };
                return new RequestResult { Success = true, Data = data };
            }
            catch (Exception ex)
            {
                return new RequestResult { Success = false, Message = "GetRecentGroupChatByUser error - " + ex.Message };
            }
        }

        /// <summary>
        /// Get UserProfile
        /// </summary>
        /// <param name="userIds">User ID</param>
        public async Task<RequestResult> GetUserProfile(List<string> userIds)
        {
            try
            {
                List<User> users = new List<User>();
                foreach (var uid in userIds)
                {
                    var user = (await _userRepository.Get(x => x.Id == uid && !x.IsDeleted)).FirstOrDefault();
                    if (user != null) users.Add(user);
                }
                return new RequestResult { Success = true, Data = users };
            }
            catch (Exception ex)
            {
                return new RequestResult { Success = false, Message = "GetRecentGroupChatByUser error - " + ex.Message };
            }
        }

        /// <summary>
        /// Update User Read Chats
        /// </summary>
        /// <param name="gid">"Group ID"</param>
        /// <param name="uid">"User ID"</param>
        /// <param name="cid">"Chat ID"</param>
        public async Task<RequestResult> UpdateUserGroupReadChats(string gid, string uid, string cid)
        {
            try
            {
                var groupUser = (await _groupUserRepository.Get(x => x.Gid == gid && x.Uid == uid)).FirstOrDefault();
                if (groupUser != null)
                {
                    groupUser.ReadChatID = cid;
                    await _groupUserRepository.Update(groupUser);
                    return new RequestResult { Success = true };
                }
                else
                {
                    return new RequestResult
                    {
                        Success = false,
                        Message = "Can't find record."
                    };
                }
            }
            catch (Exception ex)
            {
                return new RequestResult
                {
                    Success = false,
                    Message = "UpdateUserGroupReadChats error - " + ex.Message,
                };
            }
        }

        /// <summary>
        /// Update User Read Chats
        /// </summary>
        /// <param name="sender">"Sender ID"</param>
        /// <param name="receiver">"Receiver ID"</param>
        /// <param name="cid">"Chat ID"</param>
        public async Task<RequestResult> UpdateUserReadChats(string sender, string receiver, string cid)
        {
            try
            {
                var friend = (await _userRelationRepository.Get(x => x.Owner == sender && x.Target == receiver)).FirstOrDefault();
                if (friend != null)
                {
                    friend.ReadChatID = cid;
                    await _userRelationRepository.Update(friend);
                    return new RequestResult { Success = true };
                }
                else
                {
                    return new RequestResult
                    {
                        Success = false,
                        Message = "Can't find record."
                    };
                }
            }
            catch (Exception ex)
            {
                return new RequestResult
                {
                    Success = false,
                    Message = "UpdateUserReadChats error - " + ex.Message,
                };
            }
        }

        /// <summary>
        /// Get User Groups
        /// </summary>
        /// <param name="user">"User ID"</param>
        public async Task<RequestResult> GetUserGroups(string user)
        {
            try
            {
                var groupIds = (await _groupUserRepository.Get(x => x.Uid == user && !x.IsDeleted)).Select(x => x.Gid).ToList();
                return new RequestResult
                {
                    Success = true,
                    Data = groupIds,
                };
            }
            catch (Exception ex)
            {
                return new RequestResult
                {
                    Success = false,
                    Message = "GetUserGroups error - " + ex.Message,
                };
            }
        }

        /// <summary>
        /// Get User ConnectionIds
        /// </summary>
        /// <param name="user">"User ID"</param>
        public async Task<RequestResult> GetUserConnectionIds(string user)
        {
            try
            {
                var connectionIds = (await _onlineUserRepository.Get(x => x.Uid == user && !x.IsDeleted)).ToList();
                return new RequestResult
                {
                    Success = true,
                    Data = connectionIds,
                };
            }
            catch (Exception ex)
            {
                return new RequestResult
                {
                    Success = false,
                    Message = "GetUserConnectionIds error - " + ex.Message,
                };
            }
        }
    }
}
