using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Repositories.Models;
using Repositories;
using Services.PaymentDTO;
using Services.VNPayService;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using System.Collections.Specialized;
using System.ComponentModel;
using Microsoft.AspNetCore.Http;
using Repositories.Models.VnPay;
using Repositories.ExternalLibs;

namespace Services
{
    public class PaymentService : IVnPayService
    {
        private readonly PaymentRepository paymentRepository;
        private readonly IConfiguration configuration;

        public PaymentService(IConfiguration configuration)
        {
            paymentRepository = new PaymentRepository();
            this.configuration = configuration ?? throw new ArgumentNullException(nameof(configuration), "Configuration cannot be null.");
        }

        public PaymentService()
        {
            paymentRepository = new PaymentRepository();
        }

        public async Task<IEnumerable<Payment>> GetAllPaymentsAsync()
        {
            return await paymentRepository.GetAllAsync();
        }

        public async Task<Payment> GetPaymentAsync(int paymentId)
        {
            var payment = await paymentRepository.GetByIdAsync(paymentId);
            if (payment == null)
            {
                throw new KeyNotFoundException($"Payment with ID {paymentId} not found.");
            }
            return payment;
        }

        public async Task<Payment> CreatePaymentAsync(PaymentDto model)
        {
            var payment = new Payment
            {
                RequestId = model.RequestId,
                Method = "",
                Amount = model.Amount,
                Status = "Pending",
                PaidAt = null,
                Token = ""
            };
            await paymentRepository.CreateAsync(payment);
            return payment;

        }

        public async Task<string> CreatePaymentUrl(PaymentDto model ,HttpContext context)
        {
            var timeZoneById = TimeZoneInfo.FindSystemTimeZoneById(configuration["TimeZoneId"]);
            var timeNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZoneById);
            var tick = DateTime.Now.Ticks.ToString();
            var vnPay = new VnPayLibs();
            var urlCallBack = configuration["VnPay:PaymentReturnUrl"];

            var payment = CreatePaymentAsync(model).Result;

            vnPay.AddRequestData("vnp_Version", configuration["VnPay:Version"]);
            vnPay.AddRequestData("vnp_Command", configuration["VnPay:Command"]);
            vnPay.AddRequestData("vnp_TmnCode", configuration["VnPay:TmnCode"]);
            vnPay.AddRequestData("vnp_Amount", ((int)payment.Amount * 100).ToString());
            vnPay.AddRequestData("vnp_CreateDate", timeNow.ToString("yyyyMMddHHmmss"));
            vnPay.AddRequestData("vnp_CurrCode", configuration["VnPay:CurrCode"]);
            vnPay.AddRequestData("vnp_IpAddr", vnPay.GetIpAddress(context));
            vnPay.AddRequestData("vnp_Locale", configuration["VnPay:Locale"]);
            vnPay.AddRequestData("vnp_OrderInfo", $"Thanh toan qua VNPay so {model.RequestId} Tong tien {model.Amount}");
            vnPay.AddRequestData("vnp_OrderType", "other");
            vnPay.AddRequestData("vnp_ReturnUrl", urlCallBack);
            vnPay.AddRequestData("vnp_TxnRef", payment.PaymentId.ToString());

            var paymentUrl = vnPay.CreateRequestUrl(configuration["VnPay:BaseUrl"], configuration["VnPay:HashSecret"]);
            return paymentUrl;

        }



        public PaymentResponseModel PaymentExecute(IQueryCollection collections)
        {
            var vnPay = new VnPayLibs();
            var hashSecret = configuration["VnPay:HashSecret"];
            var responseData = vnPay.GetFullResponseData(collections, hashSecret);

            return responseData;
        }

        public async Task<bool> UpdatePaymentAsync(int paymentId, UpdateStatusRequest update)
        {
            bool success = false;

            var payment = await GetPaymentAsync(paymentId);
            if (payment == null)
            {
                throw new KeyNotFoundException($"Payment with ID {paymentId} not found.");
            }
            payment.Status = update.Status;
            payment.PaidAt = update.PaidAt;
            payment.Token = update.Token;
            await paymentRepository.UpdateAsync(payment);
            success = true;
            return success;

        }
    }
}
