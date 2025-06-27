using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Repositories.Base;
using Repositories.Models;

namespace Repositories
{
    public class TestServiceRepository : GenericRepository<TestService>
    {
        public TestServiceRepository()
        {
        }
        public async Task<TestService?> GetTestingServiceByNameAsync(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                throw new ArgumentException("Name cannot be null or empty.", nameof(name));
            }
            return await context.TestServices.FirstOrDefaultAsync(ts => ts.Name == name);
        }
    }
}
