using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services;
using Services.PaymentDTO;
using Services.VNPayService;

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
        public IActionResult CreatePaymentUrl([FromBody] PaymentRequestModel model)
        {
            if (model == null)
            {
                return BadRequest("Payment data is required.");
            }
            try
            {
                var paymentUrl = vnPayService.CreatePaymentUrl(model, HttpContext);
                return Ok(paymentUrl);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error creating payment URL: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("payment-callback-vnpay")]
        public IActionResult PaymentCallbackVnpay()
        {
            var response = vnPayService.PaymentExecute(Request.Query);
            var successDirectUrl = "https://close-annually-mongrel.ngrok-free.app/payment-success";
            return Redirect(successDirectUrl);
        }

    }

}
