using Microsoft.AspNetCore.Http;
using Repositories.ExternalLibs;
using Repositories.Models.VnPay;
using Services.PaymentDTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.VNPayService
{
    public interface IVnPayService
    {
        Task<string> CreatePaymentUrl(PaymentDto model ,HttpContext context);
        PaymentResponseModel PaymentExecute(IQueryCollection collections);

    }
}
