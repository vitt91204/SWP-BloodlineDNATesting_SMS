using Microsoft.EntityFrameworkCore;
using Repositories.Base;
using Repositories.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories
{
    public class UserRepository : GenericRepository<User>
    {
        public UserRepository()
        {
            // Default constructor initializes the context
        }

        public async Task<User?> GetUserByUsernameAndPasswordAsync(string username, string password)
        {
            return await context.Users
                .FirstOrDefaultAsync(u => u.Username == username && u.Password == password);
        }

        public async Task<User?> GetUserByUsernameAsync(string username)
        {
            return await context.Users
                .FirstOrDefaultAsync(u => u.Username == username);
        }   
    }
      
}
