using Microsoft.EntityFrameworkCore;
using Repositories.Base;
using Repositories.Data;
using Repositories.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories
{
    public class TestRequestReposity : GenericRepository<TestRequest>
    {
        public TestRequestReposity()
        {
        }

        public async Task<IEnumerable<TestRequest>> GetRequestsByStaffIdAsync(int staffId)
        {
            return await context.TestRequests
                .Where(tr => tr.StaffId == staffId)
                .ToListAsync();
        }
        public async Task<IEnumerable<TestRequest>> GetRequestsByUserIdAsync(int userId)
        {
            return await context.TestRequests
                .Where(tr => tr.UserId == userId)
                .ToListAsync();
        }
    }
}
