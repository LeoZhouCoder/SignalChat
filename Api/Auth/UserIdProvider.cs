using Microsoft.AspNetCore.SignalR;

namespace Api.Auth
{
    #region NameUserIdProvider
    public class UserIdProvider : IUserIdProvider
    {
        public string GetUserId(HubConnectionContext connection)
        {
            return connection.User?.Identity?.Name;
            //return connection.User?.FindFirst("userId")?.Value;
        }
    }
    #endregion
}