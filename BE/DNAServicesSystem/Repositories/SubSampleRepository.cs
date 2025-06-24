using Repositories.Base;
using Repositories.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Repositories
{
    public class SubSampleRepository : GenericRepository<SubSample>
    {
        public SubSampleRepository() : base() { }

        public async Task<SubSample?> GetByIdAsync(int id) => await context.SubSamples.FindAsync(id);
        public async Task<List<SubSample>> GetAllAsync() => await context.SubSamples.ToListAsync();
    }
}