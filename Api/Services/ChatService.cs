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
        private IRepository<Group> _group;
        private IRepository<User> _user;
        private IRepository<OnlineUser> _onlineUser;
        private IRepository<GroupUser> _groupUser;
        private IRepository<Chat> _chat;
        private IRepository<UserRelation> _userRelation;

        public ChatService(IRepository<Group> group,
                            IRepository<User> user,
                            IRepository<OnlineUser> onlineUser,
                            IRepository<GroupUser> groupUser,
                            IRepository<Chat> chat,
                            IRepository<UserRelation> userRelation)
        {
            _group = group;
            _user = user;
            _onlineUser = onlineUser;
            _groupUser = groupUser;
            _chat = chat;
            _userRelation = userRelation;
        }

        /// <summary>
        /// Get all groups and chat records related user
        /// </summary>
        /// <param name="uid">User ID</param>
        public async Task<RequestResult> GetGroupsAndRecords(string uid)
        {
            try
            {
                List<GroupView> groups = new List<GroupView>();
                List<string> userIds = new List<string>();

                // Get groups' ID
                var groupIds = (await _groupUser.Get(x => x.Uid == uid && !x.IsDeleted))
                .Select(x => x.Gid).ToList();

                foreach (var gid in groupIds)
                {
                    var groupView = await GetGroupView(gid);
                    if (groupView == null)
                    {
                        // TODO: Add log: group is not existent
                        continue;
                    }
                    groups.Add(groupView);
                    userIds = userIds.Union(groupView.Users).ToList();
                }
                
                if (userIds.IndexOf(uid) == -1)
                {
                    userIds.Add(uid);
                }

                List<UserView> users = await GetUserProfileByIds(userIds);

                return new RequestResult { Success = true, Data = new { groups, users } };
            }
            catch (Exception ex)
            {
                return new RequestResult { Success = false, Message = "GetGroupsAndRecords error - " + ex.Message };
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
        public async Task<RequestResult> AddChat(string sender, ChatType type, string content, string gid, string receiver = null)
        {
            try
            {
                var user = (await _user.Get(x => x.Id == sender)).FirstOrDefault();
                if (user == null || user.IsDeleted)
                {
                    return new RequestResult { Success = false, Message = "Sender is not existing." };
                }

                if (string.IsNullOrWhiteSpace(content))
                {
                    return new RequestResult { Success = false, Message = "Can't send empty message." };
                }

                if (!Enum.IsDefined(typeof(ChatType), type))
                {
                    return new RequestResult { Success = false, Message = "Unsupported message type." };
                }

                if (string.IsNullOrWhiteSpace(gid))
                {
                    return new RequestResult { Success = false, Message = "group is not existing." };
                }

                var group = (await _group.Get(x => x.Id == gid)).FirstOrDefault();
                if (group == null || group.IsDeleted)
                {
                    return new RequestResult { Success = false, Message = "Group is not existing." };
                }

                var groupUser = (await _groupUser.Get(x => x.Gid == gid && x.Uid == sender && !x.IsDeleted)).FirstOrDefault();
                if (groupUser == null || groupUser.IsDeleted)
                {
                    return new RequestResult { Success = false, Message = "Sender no authority." };
                }

                if (receiver != null)
                {
                    var userReceiver = (await _user.Get(x => x.Id == receiver)).FirstOrDefault();
                    if (userReceiver == null || userReceiver.IsDeleted)
                    {
                        return new RequestResult { Success = false, Message = "User is not existing." };
                    }

                    groupUser = (await _groupUser.Get(x => x.Gid == gid && x.Uid == sender && !x.IsDeleted)).FirstOrDefault();
                    if (groupUser == null || groupUser.IsDeleted)
                    {
                        return new RequestResult { Success = false, Message = "receiver is not in this group." };
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
                await _chat.Add(chat);
                return new RequestResult { Success = true, Data = chat };
            }
            catch (Exception ex)
            {
                return new RequestResult { Success = false, Message = "AddChat error - " + ex.Message };
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
                var chat = (await _chat.Get(x => x.Id == cid)).FirstOrDefault();
                if (chat != null)
                {
                    if (!chat.IsDeleted)
                    {
                        if (chat.Sender != editor)
                        {
                            return new RequestResult { Success = false, Message = "No authority." };
                        }
                        chat.IsDeleted = true;
                        await _chat.Update(chat);
                    }
                }
                return new RequestResult { Success = true };
            }
            catch (Exception ex)
            {
                return new RequestResult { Success = false, Message = "DeleteChat error - " + ex.Message };
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
                if (users.Count() == 0)
                {
                    return new RequestResult { Success = false, Message = "Can't create a group without any user." };
                }

                List<string> unionUsers = new List<string>();
                foreach (string uid in users)
                {
                    if (unionUsers.IndexOf(uid) == -1) unionUsers.Add(uid);
                }

                List<string> errorUsers = new List<string>();
                foreach (string uid in unionUsers)
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

                string existedGroup = null;
                if (unionUsers.Count() == 1) existedGroup = await GetExistedOneUserGroup(unionUsers[0]);
                if (unionUsers.Count() == 2) existedGroup = await GetExistedTwoUsersGroup(unionUsers[0], unionUsers[1]);
                if (existedGroup == null)
                {
                    var group = new Group()
                    {
                        Id = ObjectId.GenerateNewId().ToString(),
                        Name = name,
                        IsDeleted = false
                    };
                    await _group.Add(group);
                    // Add Users to Group
                    foreach (string uid in unionUsers)
                    {
                        var groupUser = new GroupUser()
                        {
                            Id = ObjectId.GenerateNewId().ToString(),
                            Gid = group.Id,
                            Uid = uid,
                            IsDeleted = false
                        };
                        await _groupUser.Add(groupUser);
                    }

                    var groupView = new GroupView
                    {
                        Id = group.Id,
                        Name = group.Name,
                        Users = unionUsers,
                        Chats = new List<Chat>()
                    };
                    return new RequestResult
                    {
                        Success = true,
                        Data = groupView,
                    };
                }
                else
                {
                    var group = (await _group.Get(x => x.Id == existedGroup)).FirstOrDefault();
                    if (group.IsDeleted)
                    {
                        group.IsDeleted = false;
                        await _group.Update(group);
                    }
                    var groupView = await GetGroupView(existedGroup);
                    foreach (string uid in groupView.Users)
                    {
                        var groupUser = (await _groupUser.Get(x => x.Gid == existedGroup && x.Uid == uid)).FirstOrDefault();
                        if (groupUser.IsDeleted)
                        {
                            groupUser.IsDeleted = false;
                            await _groupUser.Update(groupUser);
                        }
                    }

                    return new RequestResult
                    {
                        Success = true,
                        Data = groupView
                    };

                }
            }
            catch (Exception ex)
            {
                return new RequestResult { Success = false, Message = "CreateNewGroup error - " + ex.Message };
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
                var groupUser = (await _groupUser.Get(x => x.Gid == gid && x.Uid == editor && !x.IsDeleted)).FirstOrDefault();
                if (groupUser == null || groupUser.IsDeleted)
                {
                    return new RequestResult { Success = false, Message = "No authority." };
                }

                // delete group users
                var groupUsers = (await _groupUser.Get(x => x.Gid == gid && !x.IsDeleted));
                foreach (var gUser in groupUsers)
                {
                    gUser.IsDeleted = true;
                    await _groupUser.Update(gUser);
                }

                // delete group
                var group = (await _group.Get(x => x.Id == gid)).FirstOrDefault();
                if (group != null && !group.IsDeleted)
                {
                    group.IsDeleted = false;
                    await _group.Update(group);
                }

                return new RequestResult
                {
                    Success = true,
                };
            }
            catch (Exception ex)
            {
                return new RequestResult { Success = false, Message = "DeleteGroup error - " + ex.Message };
            }
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
                var groupUser = (await _groupUser.Get(x => x.Gid == gid && x.Uid == editor && !x.IsDeleted)).FirstOrDefault();
                if (groupUser == null || groupUser.IsDeleted)
                {
                    return new RequestResult { Success = false, Message = "No authority." };
                }

                var group = (await _group.Get(x => x.Id == gid)).FirstOrDefault();
                if (group != null && !group.IsDeleted)
                {
                    group.Name = name;
                    await _group.Update(group);

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
                    return new RequestResult { Success = false, Message = "Group is not existing." };
                }

            }
            catch (Exception ex)
            {
                return new RequestResult { Success = false, Message = "ChangeGroupName error - " + ex.Message };
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
                var groupUser = (await _groupUser.Get(x => x.Gid == gid && x.Uid == editor && !x.IsDeleted)).FirstOrDefault();
                if (groupUser == null || groupUser.IsDeleted)
                {
                    return new RequestResult { Success = false, Message = "No authority." };
                }

                var group = (await _group.Get(x => x.Id == gid)).FirstOrDefault();
                if (group == null || group.IsDeleted)
                {
                    return new RequestResult { Success = false, Message = "Group is not existing." };
                }

                if (!(await IsUserExisted(uid)))
                {
                    return new RequestResult { Success = false, Message = "User is not existing." };
                }

                groupUser = (await _groupUser.Get(x => x.Gid == gid && x.Uid == uid)).FirstOrDefault();
                if (groupUser != null)
                {
                    if (groupUser.IsDeleted)
                    {
                        groupUser.IsDeleted = false;
                        await _groupUser.Update(groupUser);
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
                    await _groupUser.Add(groupUser);
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
                return new RequestResult { Success = false, Message = "AddUserToGroup error - " + ex.Message };
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
                var groupUser = (await _groupUser.Get(x => x.Gid == gid && x.Uid == editor && !x.IsDeleted)).FirstOrDefault();
                if (groupUser == null || groupUser.IsDeleted)
                {
                    return new RequestResult { Success = false, Message = "No authority." };
                }

                var group = (await _group.Get(x => x.Id == gid)).FirstOrDefault();
                if (group == null || group.IsDeleted)
                {
                    return new RequestResult { Success = false, Message = "Group is not existing." };
                }

                groupUser = (await _groupUser.Get(x => x.Gid == gid && x.Uid == uid)).FirstOrDefault();
                if (groupUser != null)
                {
                    if (!groupUser.IsDeleted)
                    {
                        groupUser.IsDeleted = true;
                        await _groupUser.Update(groupUser);
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
                return new RequestResult { Success = false, Message = "RemoveUserFromGroup error - " + ex.Message };
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
                List<UserView> users = await GetUserProfileByIds(userIds);
                return new RequestResult { Success = true, Data = users };
            }
            catch (Exception ex)
            {
                return new RequestResult { Success = false, Message = "GetUserProfile error - " + ex.Message };
            }
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
                return new RequestResult { Success = true, Data = await GetGroupChats(gid, position, limit) };
            }
            catch (Exception ex)
            {
                return new RequestResult { Success = false, Message = "GetChats error - " + ex.Message };
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
                var groupIds = (await _groupUser.Get(x => x.Uid == user && !x.IsDeleted)).Select(x => x.Gid).ToList();
                return new RequestResult { Success = true, Data = groupIds };
            }
            catch (Exception ex)
            {
                return new RequestResult { Success = false, Message = "GetUserGroups error - " + ex.Message };
            }
        }

        private async Task<List<string>> GetGroupUsers(string gid)
        {
            return (await _groupUser.Get(x => x.Gid == gid && !x.IsDeleted)).Select(x => x.Uid).ToList();
        }

        private async Task<GroupView> GetGroupView(string groupId)
        {
            var group = (await _group.Get(x => x.Id == groupId && !x.IsDeleted)).FirstOrDefault();
            if (group == null) return null;
            // group users' ID
            var groupUsers = (await _groupUser.Get(x => x.Gid == groupId && !x.IsDeleted)).Select(x => x.Uid).ToList();
            return new GroupView
            {
                Id = group.Id,
                Name = group.Name,
                Users = groupUsers,
                Chats = await GetGroupChats(groupId, 0, 20)
            };
        }

        private async Task<List<Chat>> GetGroupChats(string groupId, int position, int limit)
        {
            return (await _chat.Get(x => x.Gid == groupId && !x.IsDeleted))
            .OrderByDescending(x => x.CreatedOn).Skip(position).Take(limit).OrderBy(x => x.CreatedOn).ToList();
        }

        private async Task<List<UserView>> GetUserProfileByIds(List<string> userIds)
        {
            List<UserView> users = new List<UserView>();
            foreach (var uid in userIds)
            {
                var user = (await _user.Get(x => x.Id == uid && !x.IsDeleted)).FirstOrDefault();
                if (user != null) users.Add(new UserView()
                {
                    Id = user.Id,
                    Name = user.Name,
                    ProfilePhoto = user.ProfilePhoto
                });
            }
            return users;
        }

        private async Task<string> GetExistedOneUserGroup(string uid)
        {
            var groupIds = (await _groupUser.Get(x => x.Uid == uid)).Select(x => x.Gid).ToList();

            foreach (var gid in groupIds)
            {
                var groupUsers = (await _groupUser.Get(x => x.Gid == gid && !x.IsDeleted)).Select(x => x.Uid).ToList();
                if (groupUsers.Count() != 1) continue;
                if (groupUsers[0] == uid) return gid;
            }
            return null;
        }

        private async Task<string> GetExistedTwoUsersGroup(string uid0, string uid1)
        {
            var uid0groups = (await _groupUser.Get(x => x.Uid == uid0));
            var uid1groups = (await _groupUser.Get(x => x.Uid == uid1));
            var sameGroups = (from group0 in uid0groups
                              join group1 in uid1groups
                              on group0.Gid equals group1.Gid
                              select group1.Gid).ToList();

            foreach (var groupId in sameGroups)
            {
                var groupUsers = (await _groupUser.Get(x => x.Gid == groupId && !x.IsDeleted)).Select(x => x.Uid).ToList();
                if (groupUsers.Count() == 2) return groupId;
            }
            return null;
        }

        private async Task<Boolean> IsUserExisted(string uid)
        {
            return ((await _user.Get(x => x.Id == uid)).FirstOrDefault()) != null;
        }

        //=============================================================================================

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
                var groupUser = (await _groupUser.Get(x => x.Gid == gid && x.Uid == uid)).FirstOrDefault();
                if (groupUser != null)
                {
                    groupUser.ReadChatID = cid;
                    await _groupUser.Update(groupUser);
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
                var friend = (await _userRelation.Get(x => x.Owner == sender && x.Target == receiver)).FirstOrDefault();
                if (friend != null)
                {
                    friend.ReadChatID = cid;
                    await _userRelation.Update(friend);
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
    }
}
