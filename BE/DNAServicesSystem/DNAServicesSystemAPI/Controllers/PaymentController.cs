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
            var payments = await paymentService.GetPaymentsByStatusAsync("All");
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
        [Route("{paymentId:int}")]
        public async Task<IActionResult> UpdatePayment(int paymentId, [FromBody] PaymentDto paymentDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                await paymentService.UpdatePaymentAsync(paymentId, paymentDTO);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
