using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Models
{
    public partial class Payment
    {
        public int paymentId { get; set; }
        public string? paymentMethod { get; set; }
        public decimal amount { get; set; }
        public DateTime paymentDate { get; set; }
        public string? status { get; set; } 
        public string? requestId { get; set; } 
    }
}
