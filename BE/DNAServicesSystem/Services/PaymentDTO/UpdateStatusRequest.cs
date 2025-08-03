using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.PaymentDTO
{
    public class UpdateStatusRequest
    {
        public string Status { get; set; } // e.g., "Pending", "Paid", "Failed"
        public DateTime PaidAt { get; set; } = DateTime.UtcNow;
        public string Token { get; set; } 
    }
}
