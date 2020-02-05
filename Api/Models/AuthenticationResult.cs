using Api.Auth;

namespace Api.Models
{
    public class AuthenticationResult
    {
        public bool Success { get; set; }
        public JsonWebToken Token { get; set; }
        public UserProfile User { get; set; }
        public string Message { get; set; }
    }
}
