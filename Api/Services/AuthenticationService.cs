using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Api.Commands;
using Api.Contracts;
using Api.Models;
using Api.Auth;

namespace Api.Services
{
    public class AuthenticationService : IAuthenticationService
    {
        private IRepository<User> _userRepository;
        private IPasswordStorage _encryptPassword;
        private IJwtHandler _jwtHandler;

        public AuthenticationService(IRepository<User> userRepository,
                                IPasswordStorage encryptPassword,
                                IJwtHandler jwtHandler)
        {
            _userRepository = userRepository;
            _encryptPassword = encryptPassword;
            _jwtHandler = jwtHandler;
        }

        /// <summary>
        /// Register new user
        /// </summary>
        /// <param name="user"></param>
        public async Task<JsonWebToken> SignUp(CreateUser user)
        {
            user.Email = string.IsNullOrEmpty(user.Email) ? "" : user.Email.ToLower();
            var existingUser = (await _userRepository.Get(x => x.Email == user.Email)).FirstOrDefault();
            if (existingUser != null)
            {
                throw new ApplicationException("This email address is already in use by another account");
            }
            try
            {
                var userModel = new User()
                {
                    Id = ObjectId.GenerateNewId().ToString(),
                    UId = Guid.NewGuid(),
                    Email = user.Email,
                    PasswordHash = _encryptPassword.CreateHash(user.Password),
                    UserType = user.UserRole.ToString(),
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    TermsAccepted = user.TermsConditionsAccepted,
                    CreatedOn = DateTime.UtcNow,
                    IsDeleted = false
                };
                await _userRepository.Add(userModel);
                var jsonWebToken = _jwtHandler.Create(userModel.Id);
                return jsonWebToken;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Register error - " + ex.Message);
            }
        }

        /// <summary>
        /// Sign In
        /// </summary>
        /// <param name="email"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        public async Task<AuthenticationResult> SignIn(string email, string password)
        {
            email = string.IsNullOrEmpty(email) ? "" : email.ToLower();
            User user = (await _userRepository.Get(x => x.Email == email)).FirstOrDefault();

            if (user == null)
            {
                return new AuthenticationResult
                {
                    Success = false,
                    Message = "User is not found",
                };
            }

            if (string.IsNullOrEmpty(password) || !_encryptPassword.VerifyPassword(password, user.PasswordHash))
            {
                return new AuthenticationResult
                {
                    Success = false,
                    Message = "Password is incorrect",
                };
            }
            if (user.IsDeleted)
            {
                user.IsDeleted = false;
                await _userRepository.Update(user);
            }
            
            var jsonWebToken = _jwtHandler.Create(user.Id);

            var userProfile = new UserProfile
            {
                UserName = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName
            };

            return new AuthenticationResult
            {
                Success = true,
                Token = jsonWebToken,
                User = userProfile
            }; ;
        }
    }
}
