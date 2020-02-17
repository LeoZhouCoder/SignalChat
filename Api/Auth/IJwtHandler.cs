namespace Api.Auth
{
    public interface IJwtHandler
    {
        JsonWebToken Create(string userId);
    }
}
