using System.ComponentModel.DataAnnotations;

namespace Api.Commands
{
    public class LoginCommand : ICommand
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
        /*public LoginCommand(string email)
        {
            Email = string.IsNullOrEmpty(email) ? "" : email.ToLower();
        }*/
    }
}
