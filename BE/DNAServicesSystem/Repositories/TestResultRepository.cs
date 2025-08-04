using Repositories.Base;
using Repositories.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Repositories
{
    public class TestResultRepository : GenericRepository<TestResult>
    {
        public TestResultRepository() : base() { }

        public async Task<TestResult?> GetByIdAsync(int id) => await context.TestResults.FindAsync(id);

        public async Task<List<TestResult>> GetBySampleIdAsyncToList(int sampleId)
        {
            return await context.TestResults
                .Where(tr => tr.SampleId == sampleId)
                .ToListAsync();
        }
        public async Task<TestResult?> GetBySampleIdAsync(int sampleId)
        {
            return await context.TestResults.FindAsync(sampleId);
        }
    }
}