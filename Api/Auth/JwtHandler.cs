using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Api.Auth
{
    public class JwtHandler : IJwtHandler
    {
        private readonly JwtSecurityTokenHandler _jwtSecurityTokenHandler = new JwtSecurityTokenHandler();
        private readonly JwtOptions _options;
        private readonly SigningCredentials _credentials;
        public JwtHandler(IOptions<JwtOptions> options)
        {
            _options = options.Value;
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.SecretKey));
            _credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
        }

        public string Create(string userId)
        {
             var claims = new[] {
                new Claim(JwtRegisteredClaimNames.UniqueName, userId.ToString()),
                new Claim("userId", userId.ToString()),
            };
            var now = DateTime.Now;
            var expires = now.AddMinutes(_options.ExpiryMinutes);
            var jwt = new JwtSecurityToken(
                issuer: _options.Issuer,
                claims: claims,
                notBefore: now,
                expires: expires,
                signingCredentials: _credentials
            );
            return _jwtSecurityTokenHandler.WriteToken(jwt);
        }
    }
}
