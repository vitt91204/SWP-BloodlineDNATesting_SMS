using Microsoft.AspNetCore.Mvc;
using Repositories;
using Services;
using Services.TestRequestDTO;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DNAServicesSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestRequestController : ControllerBase
    {
        private readonly TestRequestService testRequestService;

        public TestRequestController()
        {
            testRequestService = new TestRequestService();
        }

        [HttpGet]
        [Route("{requestId:int}")]
        public async Task<IActionResult> GetTestRequest(int requestId)
        {
            try
            {
                var testRequest = await testRequestService.GetRequestAsync(requestId);
                return Ok(testRequest);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllTestRequests()
        {
            var testRequests = await testRequestService.GetAllRequestsAsync();
            return Ok(testRequests);
        }

        [HttpGet]
        [Route("user/{userId:int}")]
        public async Task<IActionResult> GetTestRequestByUserId(int userId)
        {
            try
            {
                var testRequest = await testRequestService.GetTestRequestsByUserIdAsync(userId);
                return Ok(testRequest);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpGet]
        [Route("staff/{staffId:int}")]
        public async Task<IActionResult> GetTestRequestsByStaffId(int staffId)
        {
            try
            {
                var testRequest = await testRequestService.GetTestRequestsByStaffIdAsync(staffId);
                return Ok(testRequest);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("api/testrequest")]
        public async Task<IActionResult> CreateTestRequest([FromBody] AppointmentTestRequestDto testRequestDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var testRequest = await testRequestService.CreateTestRequestAsync(testRequestDto);
            return CreatedAtAction(nameof(GetTestRequest), new { requestId = testRequest.RequestId }, testRequest);
        }
        [HttpPost]
        [Route("self-request")]
        public async Task<IActionResult> CreateSelfTestRequest([FromBody] RequestTestDto testRequestDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var testRequest = await testRequestService.CreateTestRequestAsync(testRequestDto);
                return CreatedAtAction(nameof(GetTestRequest), new { requestId = testRequest.RequestId }, testRequest);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete]
        [Route("{requestId:int}")]
        public async Task<IActionResult> DeleteTestRequest(int requestId)
        {
            try
            {
                await testRequestService.DeleteTestRequestAsync(requestId);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }
        [HttpPut]
        [Route("{requestId:int}")]
        public async Task<IActionResult> UpdateTestRequest(int requestId, [FromBody] AppointmentTestRequestDto updateTestRequestDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                return Ok(await testRequestService.UpdateTestRequestAsync(requestId, updateTestRequestDto));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }
        [HttpPut]
        [Route("assign/{requestId:int}")]

        public async Task<IActionResult> AssignStaff(int requestId, int staffId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var testRequest = await testRequestService.UpdateStaffRequestAsync(requestId, staffId);
            return Ok(testRequest);
        }

        [HttpPut]
        [Route("update-status/{requestId:int}")]
        public async Task<IActionResult> UpdateRequestStatus(int requestId, [FromBody] string status)
        {
            if (string.IsNullOrEmpty(status))
            {
                return BadRequest("Status cannot be null or empty.");
            }
            try
            {
                var updated = await testRequestService.UpdateStatus(requestId, status);
                return Ok(updated);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpGet("{requestId}/pdf-result")]
        public async Task<IActionResult> GetRequestPdfResult(
            int requestId,
            [FromServices] SampleService sampleService,
            [FromServices] SampleRepository sampleRepository,
            [FromServices] TestResultService testResultService) 
        {
            var sample = await sampleRepository.GetSampleByRequestidAsync(requestId);
            if (sample == null)
                return NotFound("No sample found for this request.");

            var pdfBytes = await testResultService.GetSampleResultPdfAsync(sample.SampleId); 
            if (pdfBytes == null)
                return NotFound("PDF result not found for this request.");

            return File(pdfBytes, "application/pdf", $"Request_{requestId}_Result.pdf");
        }
    }
}
