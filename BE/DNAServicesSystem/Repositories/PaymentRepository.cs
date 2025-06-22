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
    public class PaymentRepository : GenericRepository<Payment>
    {
        public PaymentRepository() { }

        public async Task<List<Payment>> GetPaymentByStatusAsync(string status)
        {
            return await context.Payments
                .Where(p => p.Status == status)
                .ToListAsync();
        }
    }
}
