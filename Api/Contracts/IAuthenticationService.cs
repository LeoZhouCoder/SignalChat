using System.Threading.Tasks;
using Api.Commands;
using Api.Models;
using Api.Auth;
namespace Api.Services
{
    public interface IAuthenticationService
    {
        Task<AuthenticationResult> SignUp(CreateUser user);
        Task<AuthenticationResult> SignIn(string email, string password);
    }
}
