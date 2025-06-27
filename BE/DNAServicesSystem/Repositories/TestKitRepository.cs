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
    public class TestKitRepository : GenericRepository<TestKit>
    {
        public TestKitRepository()
        {
        }
        public async Task<TestKit?> GetTestKitByNameAsync(string name)
        {
            return await context.TestKits
                .FirstOrDefaultAsync(tk => tk.Name == name);
        }
    }
}
