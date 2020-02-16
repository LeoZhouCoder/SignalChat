using System.Threading.Tasks;
using System.Collections.Generic;
using Api.Models;
namespace Api.Services
{
    public interface IChatService
    {
        Task<RequestResult> CreateGroup(string name, List<string> users);
        Task<RequestResult> DeleteGroup(string gid);
        Task<RequestResult> UpdateGroup(string gid, string name);
        Task<RequestResult> AddUserToGroup(string gid, string uid);
        Task<RequestResult> RemoveUserFromGroup(string gid, string uid);
        Task<RequestResult> AddChat(string uid, string gid, int type, string content);
        Task<RequestResult> DeleteChat(string cid);

    }
}
