using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.PaymentDTO
{
    public class PaymentDto
    {

        [Required]
        public int PaymentId { get; set; }

        [Required]
        public int RequestId { get; set; }

        [Required]
        [StringLength(50)]
        public string Method { get; set; } = string.Empty;

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be positive.")]
        public decimal Amount { get; set; }

        [StringLength(20)]
        public string? Status { get; set; }

        [StringLength(100)]
        public string? Token { get; set; }
    }
}
