using Repositories.Base;
using Repositories.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Repositories
{
    public class TestResultRepository : GenericRepository<TestResult>
    {
        public TestResultRepository() : base() { }

        public async Task<TestResult?> GetByIdAsync(int id) => await context.TestResults.FindAsync(id);
    }
}