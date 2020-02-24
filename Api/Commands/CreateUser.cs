using System.ComponentModel.DataAnnotations;

namespace Api.Commands
{
    public class CreateUser : ICommand
    {
        [EmailAddress(ErrorMessage = "The Email field doesn't contain a valid email address.")]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
        [Required(ErrorMessage = "The Confirm Password field is required.")]
        public string ConfirmPassword { get; set; }
        [Required(ErrorMessage = "The Name field is required.")]
        public string Name { get; set; }
    }
}
