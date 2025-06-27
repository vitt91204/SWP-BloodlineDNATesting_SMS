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

        public async Task<TestRequest?> GetRequestByUserIdAsync(int userId)
        {
            return await context.TestRequests
                .FirstOrDefaultAsync(tr => tr.UserId == userId);
        }
        public async Task<IEnumerable<TestRequest>> GetRequestsByUserIdAsync(int userId)
        {
            return await context.TestRequests
                .Where(tr => tr.UserId == userId)
                .ToListAsync();
        }
        public async Task<TestRequest?> GetRequestByServiceIdAsync(int serviceId)
        {
            return await context.TestRequests
                .FirstOrDefaultAsync(tr => tr.ServiceId == serviceId);
        }

        public async Task<IEnumerable<TestRequest>> GetRequestsByServiceIdAsync(int serviceId)
        {
            return await context.TestRequests
                .Where(tr => tr.ServiceId == serviceId)
                .ToListAsync();

        }
    }
}
