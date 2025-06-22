using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Repositories.Models;
using Repositories;
using Services.PaymentDTO;

namespace Services
{
    public class PaymentService
    {
        private readonly PaymentRepository paymentRepository;

        public PaymentService()
        {
            paymentRepository = new PaymentRepository();
        }

        public async Task<List<Payment>> GetPaymentsByStatusAsync(string status)
        {
            var payments = await paymentRepository.GetPaymentByStatusAsync(status);
            return payments;
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

        public async Task<Payment> CreatePaymentAsync (PaymentDto paymentDTO)
        {
            if (paymentDTO == null)
            {
                throw new ArgumentNullException(nameof(paymentDTO), "Payment DTO cannot be null.");
            }

            var payment = new Payment
            {
                RequestId = paymentDTO.RequestId,
                Method = paymentDTO.Method,
                Amount = paymentDTO.Amount,
                Status = paymentDTO.Status,
                PaidAt = paymentDTO.PaidAt
            };
            await paymentRepository.CreateAsync(payment);
            return payment;
        }

        public async Task UpdatePaymentAsync(int paymentId, PaymentDto paymentDTO)
        {
            if (paymentDTO == null)
            {
                throw new ArgumentNullException(nameof(paymentDTO), "Payment DTO cannot be null.");
            }
            var payment = await paymentRepository.GetByIdAsync(paymentId);
            if (payment == null)
            {
                throw new KeyNotFoundException($"Payment with ID {paymentId} not found.");
            }
            payment.Method = paymentDTO.Method;
            payment.Amount = paymentDTO.Amount;
            payment.Status = paymentDTO.Status;
            payment.PaidAt = paymentDTO.PaidAt;
            await paymentRepository.UpdateAsync(payment);
        }
    }
}
