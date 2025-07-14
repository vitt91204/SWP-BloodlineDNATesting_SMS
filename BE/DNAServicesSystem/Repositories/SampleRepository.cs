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

<<<<<<< Updated upstream
        public async Task<List<Sample>> SearchSamplesAsync(string? serviceName, string? userFullName)
        {
            var query = context.Samples
                .Include(s => s.Request)
                    .ThenInclude(r => r.Service)
                .Include(s => s.Request)
                    .ThenInclude(r => r.User)
                .AsQueryable();

            if (!string.IsNullOrEmpty(serviceName))
                query = query.Where(s => s.Request.Service.Name.Contains(serviceName));

            if (!string.IsNullOrEmpty(userFullName))
                query = query.Where(s => s.Request.User.FullName.Contains(userFullName));

            return await query.ToListAsync();
=======
        public async Task<Sample> GetSampleByRequestidAsync (int requestId) 
        {
            var sample = await context.Samples.FirstOrDefaultAsync(s => s.RequestId == requestId);
            if (sample == null)
            {
                throw new KeyNotFoundException($"Sample with TestRequestId {requestId} not found.");
            }
            return sample;
>>>>>>> Stashed changes
        }
    }
}