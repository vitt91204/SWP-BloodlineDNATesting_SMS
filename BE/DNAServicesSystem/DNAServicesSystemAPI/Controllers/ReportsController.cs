using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services;

namespace DNAServicesSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly ReportService reportService;
        public ReportsController(ReportService reportService)
        {
            this.reportService = reportService;
        }
        [HttpGet]
        [Route("/monthly-revenue")]
        public IActionResult GetMonthlyRevenue(int year, int month)
        {
            try
            {
                var report = reportService.MonthlyRevenue(year, month);
                return Ok(report);
            }
            catch (ArgumentOutOfRangeException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("/this-month-payments")]
        public IActionResult GetThisMonthPayments(int year, int month)
        {
            try
            {
                var payments = reportService.GetThisMonthPayments(year, month);
                return Ok(payments);
            }
            catch (ArgumentOutOfRangeException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("/this-month-requests")]
        public IActionResult GetThisMonthRequests(int year, int month)
        {
            try
            {
                var requests = reportService.GetThisMonthRequests(year, month);
                return Ok(requests);
            }
            catch (ArgumentOutOfRangeException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Internal server error: {ex.Message}");
            }

        }

        [HttpGet]
        [Route("/monthly-requests")]
        public IActionResult GetMonthlyRequests(int year, int month)
        {
            try
            {
                var report = reportService.GetTotalMonthlyRequests(year, month);
                return Ok(report);
            }
            catch (ArgumentOutOfRangeException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("/daily-requests")]
        public IActionResult GetDailyRequests(int year, int month, int day)
        {
            try
            {
                var report = reportService.GetDailyRequests(year, month, day);
                return Ok(report);
            }
            catch (ArgumentOutOfRangeException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Internal server error: {ex.Message}");
            }
        }
    }
}
