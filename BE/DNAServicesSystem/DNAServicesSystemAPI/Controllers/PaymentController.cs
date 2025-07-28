using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services;
using Services.PaymentDTO;
using Services.VNPayService;
using System.Threading.Tasks;

namespace DNAServicesSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
       private readonly IVnPayService vnPayService;
       private readonly PaymentService paymentService;
        public PaymentController(IVnPayService vnPayService, PaymentService paymentService)
        {

            this.vnPayService = vnPayService;
            this.paymentService = paymentService;
        }


        [HttpGet]
        [Route("all-payments")]
        public async Task<IActionResult> GetAllPayments()
        {
            var payments = await paymentService.GetAllPaymentsAsync();
            return Ok(payments);
        }

        [HttpGet]
        [Route("{paymentId:int}")]
        public async Task<IActionResult> GetPaymentById(int paymentId)
        {
            try
            {
                var payment = await paymentService.GetPaymentAsync(paymentId);
                return Ok(payment);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("create-payment-url")]
        public IActionResult CreatePaymentUrl(PaymentDto model)
        {
            try
            {
                var paymentUrl = vnPayService.CreatePaymentUrl(model , HttpContext);
                return Ok(paymentUrl);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error creating payment URL: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("payment-callback-vnpay")]
        public async Task<IActionResult> PaymentCallbackVnpay()
        {
            var response = vnPayService.PaymentExecute(Request.Query);
            if (response.ResponseCode == "00")
            {
                int paymentId = int.Parse(response.OrderId);
                var updatePayment = new UpdateStatusRequest
                {
                    Status = "Paid",
                    PaidAt = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time")),
                    Token = response.PaymentMethod + " - " + response.TransactionId
                };
                await paymentService.UpdatePaymentAsync(paymentId, updatePayment);
            }



            //var successDirectUrl = "http://10.87.48.38:8080/payment-success";
            var successDirectUrl = "http://192.168.2.100:8080/payment-success";
            return Redirect(successDirectUrl);

        }

    }

}
