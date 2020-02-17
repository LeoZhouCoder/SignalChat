using System;
namespace Api.Auth
{
    public class JsonWebToken
    {
        public string Token { get; set; }
        public DateTime Expires { get; set; }
    }
}
