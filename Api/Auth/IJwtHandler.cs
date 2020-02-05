using System.Security.Claims;

namespace Api.Auth
{
    public interface IJwtHandler
    {
        JsonWebToken Create(string userId);
        ClaimsPrincipal ValidateToken(string token);
    }
}
