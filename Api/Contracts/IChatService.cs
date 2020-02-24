using System.Threading.Tasks;
using System.Collections.Generic;
using Api.Models;
namespace Api.Services
{
    public interface IChatService
    {
        Task<RequestResult> GetAllUsers();
        Task<RequestResult> GetGroupsAndRecords(string uid);
        Task<RequestResult> CreateGroup(string name, List<string> users);
        Task<RequestResult> DeleteGroup(string editor, string gid);
        Task<RequestResult> UpdateGroup(string editor, string gid, string name, List<string> users);
        Task<RequestResult> AddUserToGroup(string editor, string gid, string uid);
        Task<RequestResult> RemoveUserFromGroup(string editor, string gid, string uid);
        Task<RequestResult> AddChat(string sender, ChatType type, string content, string gid = null, string receiver = null);
        Task<RequestResult> DeleteChat(string editor, string cid);
        Task<RequestResult> GetChatsByGroupId(string gid, int position, int limit);
        Task<RequestResult> GetUserProfile(List<string> userIds);
        Task<RequestResult> GetUserGroups(string user);
    }
}
