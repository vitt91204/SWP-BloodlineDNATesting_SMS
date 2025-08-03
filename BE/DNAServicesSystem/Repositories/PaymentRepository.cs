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


    public async Task<Payment?> GetPaymentByRequestIdAsync(int requestId)
        {
            if (requestId <= 0)
            {
                throw new ArgumentException("Request ID must be a valid positive integer", nameof(requestId));
            }
            return await context.Payments
                .FirstOrDefaultAsync(p => p.RequestId == requestId);
        }
    }
}
