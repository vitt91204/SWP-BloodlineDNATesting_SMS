using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.PaymentDTO
{
    public class DetailedPaymentInfo
    {
        
        public int PaymentId { get; set; }

        public int RequestId { get; set; }

        public string Method { get; set; } = null!;

        public decimal Amount { get; set; }

        public string? Status { get; set; }

        public DateTime? PaidAt { get; set; }

        public string? Token { get; set; }

        public string? UserFullname { get; set; }
    }
}
