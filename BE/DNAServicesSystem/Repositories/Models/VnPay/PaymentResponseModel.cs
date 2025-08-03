using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Models.VnPay
{
    public class PaymentResponseModel
    {
        public string OrderDescription { get; set; }
        public string TransactionId { get; set; }
        public string OrderId { get; set; }
        public string PaymentMethod { get; set; }
        public string PaymentId { get; set; }

        public string ResponseCode { get; set; }
        public bool IsSuccess { get; set; }

        public string Token { get; set; }
    }
}
