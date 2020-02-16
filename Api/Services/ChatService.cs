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

        public ChatService(IRepository<Group> groupRepository,
                            Repository<User> userRepository,
                            Repository<GroupUser> groupUserRepository,
                            Repository<Chat> chatRepository)
        {
            _groupRepository = groupRepository;
            _userRepository = userRepository;
            _groupUserRepository = groupUserRepository;
            _chatRepository = chatRepository;
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
                var existedGroup = await GetExistedGroup(users);
                if (existedGroup != null && existedGroup.IsDeleted)
                {
                    if (existedGroup.IsDeleted)
                    {
                        existedGroup.IsDeleted = false;
                        await _groupRepository.Update(existedGroup);
                    }
                    return new RequestResult
                    {
                        Success = true,
                        Data = existedGroup,
                    };
                }
                var group = new Group()
                {
                    Id = ObjectId.GenerateNewId().ToString(),
                    UId = Guid.NewGuid(),
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
                        UId = Guid.NewGuid(),
                        Gid = group.Id,
                        Uid = uid,
                        ReadChats = 0,
                        IsDeleted = false
                    };
                    await _groupUserRepository.Add(groupUser);
                }

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

        private async Task<Group> GetExistedGroup(List<string> users)
        {
            if (users.Count() != 2) return null;
            try
            {
                var queryUser0 = (await _groupUserRepository.Get(x => x.Uid == users[0]));
                var queryUser1 = (await _groupUserRepository.Get(x => x.Uid == users[1]));
                var query = from g0 in queryUser0
                            join g1 in queryUser1 on g0.Gid equals g1.Gid
                            select new { Gid = g1.Gid, u0 = g0.UId, u1 = g1.UId };

                if (query.Count() == 0) return null;
                var gid = query.ToList()[0].Gid;
                var group = (await _groupRepository.Get(x => x.Id == gid)).FirstOrDefault();
                if (group == null) return null;
                return group;
            }
            catch (Exception)
            {
                return null;
            }
        }

        /// <summary>
        /// Delete Group
        /// </summary>
        /// <param name="gid">"Group ID"</param>
        public async Task<RequestResult> DeleteGroup(string gid)
        {
            try
            {
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

        /// <summary>
        /// Update Group Name
        /// </summary>
        /// <param name="gid">"Group ID"</param>
        /// <param name="name">"Group Name"</param>
        public async Task<RequestResult> UpdateGroup(string gid, string name)
        {
            try
            {
                var group = (await _groupRepository.Get(x => x.Id == gid)).FirstOrDefault();
                if (group != null && !group.IsDeleted)
                {
                    group.Name = name;
                    await _groupRepository.Update(group);
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
        /// <param name="gid">"Group ID"</param>
        /// <param name="uid">"User ID"</param>
        public async Task<RequestResult> AddUserToGroup(string gid, string uid)
        {
            try
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

                var user = (await _userRepository.Get(x => x.Id == uid)).FirstOrDefault();
                if (user == null || user.IsDeleted)
                {
                    return new RequestResult
                    {
                        Success = false,
                        Message = "User is not existing."
                    };
                }

                var groupUser = (await _groupUserRepository.Get(x => x.Gid == gid && x.Uid == uid)).FirstOrDefault();
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
                        UId = Guid.NewGuid(),
                        Gid = gid,
                        Uid = uid,
                        ReadChats = 0,
                        IsDeleted = false
                    };
                    await _groupUserRepository.Add(groupUser);
                }
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
        /// <param name="readChats">"Chat Number"</param>
        public async Task<RequestResult> UpdateUserReadChats(string gid, string uid, int readChats)
        {
            try
            {
                var groupUser = (await _groupUserRepository.Get(x => x.Gid == gid && x.Uid == uid)).FirstOrDefault();
                if (groupUser != null)
                {
                    groupUser.ReadChats = readChats;
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
                    Message = "RemoveUserFromGroup error - " + ex.Message,
                };
            }
        }

        /// <summary>
        /// Remove User From Group
        /// </summary>
        /// <param name="gid">"Group ID"</param>
        /// <param name="uid">"User ID"</param>
        public async Task<RequestResult> RemoveUserFromGroup(string gid, string uid)
        {
            try
            {
                var groupUser = (await _groupUserRepository.Get(x => x.Gid == gid && x.Uid == uid)).FirstOrDefault();
                if (groupUser != null)
                {
                    if (!groupUser.IsDeleted)
                    {
                        groupUser.IsDeleted = true;
                        await _groupUserRepository.Update(groupUser);
                    }
                }
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
        /// <param name="gid">Group ID</param>
        /// <param name="uid">User ID</param>
        /// <param name="type">Chat Type</param>
        /// <param name="content">Chat Content</param>
        public async Task<RequestResult> AddChat(string uid, string gid, int type, string content)
        {
            try
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

                var user = (await _userRepository.Get(x => x.Id == uid)).FirstOrDefault();
                if (user == null || user.IsDeleted)
                {
                    return new RequestResult
                    {
                        Success = false,
                        Message = "User is not existing."
                    };
                }

                var chat = new Chat()
                {
                    Id = ObjectId.GenerateNewId().ToString(),
                    UId = Guid.NewGuid(),
                    Type = type,
                    Content = content,
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
                var returnChats = chats.OrderByDescending(x => x.CreatedOn).Skip(position).Take(limit)
                .Select(x => new { x.Id, x.Uid, x.Type, x.Content, x.CreatedOn });
                return new RequestResult { Success = true, Data = returnChats };
            }
            catch (Exception ex)
            {
                return new RequestResult { Success = false, Message = "GetChats error - " + ex.Message };
            }
        }

        /// <summary>
        /// Get Recent Group Chat By User
        /// </summary>
        /// <param name="gid">Group ID</param>
        public async Task<RequestResult> GetRecentGroupChatByUser(string uid)
        {
            try
            {
                var groupIds = (await _groupUserRepository.Get(x => x.Uid == uid && !x.IsDeleted)).Select(x => x.Gid).ToList();
                List<ChatGroupView> groups = new List<ChatGroupView>();
                foreach (var gid in groupIds)
                {
                    var group = (await _groupRepository.Get(x => x.Id == gid && !x.IsDeleted)).FirstOrDefault();
                    var lastChat = (await _chatRepository.Get(x => x.Gid == gid && !x.IsDeleted)).FirstOrDefault();
                    var users = (await _groupUserRepository.Get(x => x.Gid == gid && !x.IsDeleted)).Select(x => x.Uid).ToList();
                    var view = new ChatGroupView
                    {
                        Id = group.Id,
                        Name = group.Name,
                        Users = users,
                        LastChat = lastChat
                    };
                    groups.Add(view);
                }
                return new RequestResult { Success = true, Data = groups };
            }
            catch (Exception ex)
            {
                return new RequestResult { Success = false, Message = "GetRecentGroupChatByUser error - " + ex.Message };
            }
        }
    }
}
