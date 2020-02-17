using MongoDB.Bson;
using System;
using System.Linq;
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
        public async Task<AuthenticationResult> SignUp(CreateUser user)
        {
            user.Email = string.IsNullOrEmpty(user.Email) ? "" : user.Email.ToLower();
            var existingUser = (await _userRepository.Get(x => x.Email == user.Email)).FirstOrDefault();
            if (existingUser != null)
            {
                return new AuthenticationResult
                {
                    Success = false,
                    Message = "This email address is already in use by another account",
                };
            }
            try
            {
                var userModel = new User()
                {
                    Id = ObjectId.GenerateNewId().ToString(),
                    Email = user.Email,
                    PasswordHash = _encryptPassword.CreateHash(user.Password),
                    Name = user.FirstName + " " + user.LastName,
                    ProfilePhoto = "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTJ-mXuETtV9PelHdVOYG7yMwKVZpW1NGNpFwND484eFIxU8IBe",
                    CreatedOn = DateTime.UtcNow,
                    ActiveTime = DateTime.UtcNow,
                    IsDeleted = false
                };
                await _userRepository.Add(userModel);
                var jsonWebToken = _jwtHandler.Create(userModel.Id);

                var userProfile = new UserView
                {
                    Id = userModel.Id,
                    Email = userModel.Email,
                    Name = userModel.Name,
                    ProfilePhoto = userModel.ProfilePhoto
                };

                return new AuthenticationResult
                {
                    Success = true,
                    Token = jsonWebToken,
                    User = userProfile
                };
            }
            catch (Exception ex)
            {
                return new AuthenticationResult
                {
                    Success = false,
                    Message = "Register error - " + ex.Message,
                };
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
            user.IsDeleted = false;
            user.ActiveTime = DateTime.UtcNow;
            await _userRepository.Update(user);

            var jsonWebToken = _jwtHandler.Create(user.Id);

            var userProfile = new UserView
            {
                Id = user.Id,
                Email = user.Email,
                Name = user.Name,
                ProfilePhoto = user.ProfilePhoto
            };

            return new AuthenticationResult
            {
                Success = true,
                Token = jsonWebToken,
                User = userProfile
            };
        }
    }
}
