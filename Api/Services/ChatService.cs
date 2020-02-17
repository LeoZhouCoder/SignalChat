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
        private IRepository<GroupUser> _groupUserRepository;
        private IRepository<Chat> _chatRepository;
        private IRepository<UserRelation> _userRelationRepository;

        public ChatService(IRepository<Group> groupRepository,
                            IRepository<User> userRepository,
                            IRepository<GroupUser> groupUserRepository,
                            IRepository<Chat> chatRepository,
                            IRepository<UserRelation> userRelationRepository)
        {
            _groupRepository = groupRepository;
            _userRepository = userRepository;
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
                        Message = "Can't find user: " + errorUsers + " when create group.",
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
                await UpdateUserActiveTime(users[0]);
                return new RequestResult
                {
                    Success = true,
                    Data = group,
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
                var groupUser = (await _groupUserRepository.Get(x => x.Gid == gid && x.Uid == editor)).FirstOrDefault();
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
                    group.IsDeleted = false;
                    await _groupRepository.Update(group);
                }
                await UpdateUserActiveTime(editor);
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

        /// <summary>
        /// Update Group Name
        /// </summary>
        /// <param name="editor">"Editor ID"</param>
        /// <param name="gid">"Group ID"</param>
        /// <param name="name">"Group Name"</param>
        public async Task<RequestResult> UpdateGroup(string editor, string gid, string name)
        {
            try
            {
                var groupUser = (await _groupUserRepository.Get(x => x.Gid == gid && x.Uid == editor)).FirstOrDefault();
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
                    await UpdateUserActiveTime(editor);
                    return new RequestResult { Success = true };
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
                    Message = "UpdateGroup error - " + ex.Message,
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
                var groupUser = (await _groupUserRepository.Get(x => x.Gid == gid && x.Uid == editor)).FirstOrDefault();
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
                await UpdateUserActiveTime(editor);
                return new RequestResult { Success = true };
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
                    await UpdateUserActiveTime(uid);
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
                    await UpdateUserActiveTime(sender);
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
        /// Remove User From Group
        /// </summary>
        /// <param name="editor">"Editor ID"</param>
        /// <param name="gid">"Group ID"</param>
        /// <param name="uid">"User ID"</param>
        public async Task<RequestResult> RemoveUserFromGroup(string editor, string gid, string uid)
        {
            try
            {
                var groupUser = (await _groupUserRepository.Get(x => x.Gid == gid && x.Uid == editor)).FirstOrDefault();
                if (groupUser == null || groupUser.IsDeleted)
                {
                    return new RequestResult
                    {
                        Success = false,
                        Message = "No authority.",
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
                await UpdateUserActiveTime(editor);
                return new RequestResult { Success = true };
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
        public async Task<RequestResult> AddChat(string sender, int type, string content, string gid = null, string receiver = null)
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
                await UpdateUserActiveTime(sender);
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
        public async Task<RequestResult> DeleteChat(string cid)
        {
            try
            {
                var chat = (await _chatRepository.Get(x => x.Id == cid)).FirstOrDefault();
                if (chat != null)
                {
                    if (!chat.IsDeleted)
                    {
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

        /// <summary>
        /// Add Relation
        /// </summary>
        /// <param name="owner">Owner User ID</param>
        /// <param name="target">Target User ID</param>
        /// <param name="type">Relation Type</param>
        public async Task<RequestResult> AddRelation(string owner, string target, int type = 0)
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
                await UpdateUserActiveTime(owner);
                return new RequestResult { Success = true, Data = relation };
            }
            catch (Exception ex)
            {
                return new RequestResult { Success = false, Message = "AddRelation error - " + ex.Message };
            }
        }
        /// <summary>
        /// Delete Relation
        /// </summary>
        /// <param name="owner">Owner User ID</param>
        /// <param name="target">Target User ID</param>
        public async Task<RequestResult> DeleteRelation(string owner, string target)
        {
            try
            {
                var relation = (await _userRelationRepository.Get(x => x.Owner == owner && x.Target == target)).FirstOrDefault();
                if (relation != null && !relation.IsDeleted)
                {
                    relation.IsDeleted = true;
                    await _userRelationRepository.Update(relation);
                }
                await UpdateUserActiveTime(owner);
                return new RequestResult { Success = true };
            }
            catch (Exception ex)
            {
                return new RequestResult { Success = false, Message = "DeleteRelation error - " + ex.Message };
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
        /// Get Active Users
        /// </summary>
        /// <param name="uid">User ID</param>
        /// <param name="limit">User Number</param>
        public async Task<RequestResult> GetActiveUsers(string uid, int limit)
        {
            try
            {
                var users = await _userRepository.Get(x => !x.IsDeleted);
                var returnUsers = users.OrderByDescending(x => x.CreatedOn).Take(limit);
                await UpdateUserActiveTime(uid);
                return new RequestResult { Success = true, Data = returnUsers };
            }
            catch (Exception ex)
            {
                return new RequestResult { Success = false, Message = "GetActiveUsers error - " + ex.Message };
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
                await UpdateUserActiveTime(uid0);
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
                    chats.Add(chat);
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
                    chats.Add(chat);
                }

                List<User> users = new List<User>();
                allUserIds = allUserIds.Union(friends).ToList();
                foreach (var id in allUserIds)
                {
                    var user = (await _userRepository.Get(x => x.Id == id && !x.IsDeleted)).FirstOrDefault();
                    users.Add(user);
                }

                var data = new
                {
                    chats,
                    groups,
                    users
                };
                await UpdateUserActiveTime(uid);
                return new RequestResult { Success = true, Data = data };
            }
            catch (Exception ex)
            {
                return new RequestResult { Success = false, Message = "GetRecentGroupChatByUser error - " + ex.Message };
            }
        }

        private async Task<Boolean> UpdateUserActiveTime(string uid)
        {
            try
            {
                var user = (await _userRepository.Get(x => x.Id == uid)).FirstOrDefault();
                if (user == null || user.IsDeleted) return false;
                user.ActiveTime = DateTime.UtcNow;
                await _userRepository.Update(user);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
