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
        [Required(ErrorMessage = "The First Name field is required.")]
        public string FirstName { get; set; }
        [Required(ErrorMessage = "The Last Name field is required.")]
        public string LastName { get; set; }
        [Required]
        [EnumDataType(typeof(UserRole), ErrorMessage = "Invaild inputs.")]
        public UserRole UserRole { get; set; }
        [Required]
        [Range(typeof(bool), "true", "true", ErrorMessage = "Please accept the terms and conditions.")]
        public bool TermsConditionsAccepted { get; set; }
        /*public CreateUser()
        {
            //Email = string.IsNullOrEmpty(email) ? "" : email.ToLower();
        }*/
    }
    public enum UserRole { Customer = 1, Wholesaler, Employee, Administrator }
}
