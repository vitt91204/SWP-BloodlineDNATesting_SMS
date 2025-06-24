using Repositories.Base;
using Repositories.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Repositories
{
    public class SampleRepository : GenericRepository<Sample>
    {
        public SampleRepository() : base() { }

        public async Task<Sample?> GetByIdAsync(int id) => await context.Samples.FindAsync(id);
        public async Task<List<Sample>> GetAllAsync() => await context.Samples.ToListAsync();
    }
}