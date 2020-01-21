namespace Api.Auth
{
    public class JsonWebToken
    {
        public string Token { get; set; }
        public long Expires { get; set; }
        public string UserRole { get; set; }
        public string Username { get; set; }
    }
}
