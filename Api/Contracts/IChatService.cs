using System.Threading.Tasks;
using System.Collections.Generic;
using Api.Models;
namespace Api.Services
{
    public interface IChatService
    {
        Task<RequestResult> CreateGroup(string name, List<string> users);
        Task<RequestResult> DeleteGroup(string editor, string gid);
        Task<RequestResult> UpdateGroup(string editor, string gid, string name);
        Task<RequestResult> AddUserToGroup(string editor, string gid, string uid);
        Task<RequestResult> RemoveUserFromGroup(string editor, string gid, string uid);
        Task<RequestResult> AddChat(string sender, int type, string content, string gid = null, string receiver = null);
        Task<RequestResult> DeleteChat(string cid);
        Task<RequestResult> GetRecentChatsByUser(string uid);

    }
}
