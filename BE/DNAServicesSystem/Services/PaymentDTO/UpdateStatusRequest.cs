using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.PaymentDTO
{
    public class UpdateStatusRequest
    {
        public int PaymentId { get; set; }
        public string Status { get; set; } // e.g., "Pending", "Completed", "Failed"
        public DateTime PaidAt { get; set; } = DateTime.UtcNow;
    }
}
