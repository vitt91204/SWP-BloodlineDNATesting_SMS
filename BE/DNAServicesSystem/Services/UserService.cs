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
            var existingUser = await userRepository.GetUserByUsernameAsync(createUserRequest.Username);
            if (existingUser != null)
            {
                throw new InvalidOperationException($"User with username {createUserRequest.Username} already exists.");
            }
            if (string.IsNullOrWhiteSpace(createUserRequest.Username) || string.IsNullOrWhiteSpace(createUserRequest.Password))
            {
                throw new ArgumentException("Username and password cannot be empty.");
            }
            if (createUserRequest.Password.Length < 8)
            {
                throw new ArgumentException("Password must be at least 8 characters long.");
            }
            if (createUserRequest.Password != createUserRequest.RepeatPassword)
            {
                throw new ArgumentException("Passwords do not match.");
            }
            var user = new User
            {
                Username = createUserRequest.Username,
                Password = createUserRequest.Password,
                Email = createUserRequest.Email,
                Phone = createUserRequest.Phone,
                Role = role,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
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

        public async Task<User> UpdateUserAsync(int userId, CreateUserRequest updateUserRequest)
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
            user.UpdatedAt = DateTime.UtcNow;
            await userRepository.UpdateAsync(user);
            return user;
        }
        public async Task<User?> GetUserByUsernameAndPasswordAsync(string username, string password)
        {
            return await userRepository.GetUserByUsernameAndPasswordAsync(username, password);
        }
    }
    }
