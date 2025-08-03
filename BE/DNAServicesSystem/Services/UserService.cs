using Repositories;
using Repositories.Models;
using Services.UserDTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{

    public class UserService
    {
        private readonly UserRepository userRepository;

        public UserService()
        {
            userRepository = new UserRepository();
        }
        public async Task<User> CreateUserAsynce(CreateUserRequest createUserRequest)
        {
            var role = string.IsNullOrWhiteSpace(createUserRequest.Role) ? "Customer" : createUserRequest.Role.Trim();
            var gender = string.IsNullOrWhiteSpace(createUserRequest.Gender) ? "Other" : createUserRequest.Gender.Trim();

            var user = new User
            {
                Username = createUserRequest.Username,
                Password = createUserRequest.Password,
                Email = createUserRequest.Email,
                Phone = createUserRequest.Phone,
                Role = role,
                FullName = createUserRequest.Fullname,
                Gender = gender,
                DateOfBirth = createUserRequest.DateOfBirth,
                CreatedAt = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time")),
                UpdatedAt = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time"))
            };
            await userRepository.CreateAsync(user);

            return user;
        }

        public async Task DeleteUserAsync(int userId)
        {
            var user = await userRepository.GetByIdAsync(userId);
            if (user != null)
            {
                await userRepository.RemoveAsync(user);
            }
        }

        public async Task<IEnumerable<User>> GetUsersAsync()
        {
            return await userRepository.GetAllAsync();
        }

        public async Task<User> GetUserByIdAsync(int userId)
        {
            var user = await userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                throw new KeyNotFoundException($"User with ID {userId} not found.");
            }
            return user;
        }
        #region UpdateUserAsync
        public async Task<User> UpdateUserAsync(int userId, UpdateUserRequest updateUserRequest)
        {
            var user = await userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                throw new KeyNotFoundException($"User with ID {userId} not found.");
            }
            user.Username = updateUserRequest.Username ?? user.Username;
            user.Email = updateUserRequest.Email ?? user.Email;
            user.Phone = updateUserRequest.Phone ?? user.Phone;
            user.Role = updateUserRequest.Role ?? user.Role;
            user.FullName = updateUserRequest.Fullname ?? user.FullName;
            user.Gender = updateUserRequest.Gender ?? user.Gender;
            user.DateOfBirth = updateUserRequest.DateOfBirth ?? user.DateOfBirth;
            user.UpdatedAt = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time"));
            await userRepository.UpdateAsync(user);
            return user;
        }

        public async Task<User?> UpdateUserRoleAsync(int userId, String role)
        {
            var user = await userRepository.GetByIdAsync(userId);
            
            if (user == null)
            {
                throw new KeyNotFoundException($"User with ID {userId} not found");

            }
            user.Role = role;

            await userRepository.UpdateAsync(user);
            return user;

        }

        public async Task<User?> UpdateUserPasswordAsync(int userId, ChangePasswordRequest changePasswordRequest)
        {
            var user = await userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                throw new KeyNotFoundException($"User with ID {userId} not found.");
            }
            if (string.IsNullOrWhiteSpace(changePasswordRequest.OldPassword) || string.IsNullOrWhiteSpace(changePasswordRequest.NewPassword) || string.IsNullOrWhiteSpace(changePasswordRequest.RepeatPassword))
            {
                throw new ArgumentException("Old password, new password, and repeat password cannot be empty.");
            }
            if (user.Password != changePasswordRequest.OldPassword.Trim())
            {
                throw new ArgumentException("Old password is incorrect.");
            }
            var newPassword = changePasswordRequest.NewPassword.Trim();
            if (newPassword != changePasswordRequest.RepeatPassword.Trim())
            {
                throw new ArgumentException("Passwords do not match.");
            }
            user.Password = newPassword;
            user.UpdatedAt = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time"));
            await userRepository.UpdateAsync(user);
            return user;
        }
        #endregion

        public async Task<User?> GetUserByUsernameAndPasswordAsync(string username, string password)
        {
            return await userRepository.GetUserByUsernameAndPasswordAsync(username, password);
        }

        public async Task <User> ExistingUserAsync(int userId)
        {
            var user = await userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                throw new KeyNotFoundException($"User with ID {userId} not found.");
            }
            return user;
        }
    }
    }
