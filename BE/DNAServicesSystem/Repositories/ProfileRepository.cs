using Microsoft.EntityFrameworkCore;
using Repositories.Base;
using Repositories.Models;

using System.Threading.Tasks;

namespace Repositories
{
    public class ProfileRepository : GenericRepository<Profile>
    {
        public ProfileRepository() : base() { }

        public async Task<Profile?> GetByUserIdAsync(int userId)
        {
            return await context.Profiles.FirstOrDefaultAsync(p => p.UserId == userId);
        }
    }
}