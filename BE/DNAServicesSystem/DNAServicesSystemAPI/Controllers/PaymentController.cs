using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services;
using Services.PaymentDTO;

namespace DNAServicesSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly PaymentService paymentService;
        public PaymentController(PaymentService paymentService)
        {
            this.paymentService = paymentService;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllPayment()
        {
            var payments = await paymentService.GetAllPaymentsAsync();
            return Ok(payments);

        }
        [HttpGet]
        [Route("payment/{paymentId:int}")]
        public async Task<IActionResult> GetPayment(int paymentId)
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
        [Route("create")]
        public async Task<IActionResult> CreatePayment([FromBody] PaymentDto paymentDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var payment = await paymentService.CreatePaymentAsync(paymentDTO);
            return CreatedAtAction(nameof(GetPayment), new { paymentId = payment.PaymentId }, payment);
        }

        [HttpPut]
        [Route("update/{paymentId:int}")]
        public async Task<IActionResult> UpdatePaymentStatus(int paymentId, [FromBody] UpdateStatusRequest updateStatusRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var updatedPayment = await paymentService.UpdateStatusAsync(paymentId, updateStatusRequest);
                return Ok(updatedPayment);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
