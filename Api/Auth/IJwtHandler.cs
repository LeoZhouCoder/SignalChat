namespace Api.Auth
{
    public interface IJwtHandler
    {
        string Create(string userId);
    }
}
