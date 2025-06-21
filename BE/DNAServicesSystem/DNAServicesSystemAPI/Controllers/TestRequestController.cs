using Microsoft.AspNetCore.Mvc;
using Services;
using Services.TestRequestDTO;

namespace DNAServicesSystemAPI.Controllers
{
    public class TestRequestController : ControllerBase
    {
        [HttpGet]
        [Route("api/testrequest/{requestId:int}")]
        public async Task<IActionResult> GetTestRequest(int requestId)
        {
            var testRequestService = new TestRequestService();
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
        [Route("api/testrequest")]
        public async Task<IActionResult> GetAllTestRequests()
        {
            var testRequestService = new TestRequestService();
            var testRequests = await testRequestService.GetAllRequestsAsync();
            return Ok(testRequests);
        }

        [HttpGet]
        [Route("api/testrequest/user/{userId:int}")]
        public async Task<IActionResult> GetTestRequestByUserId(int userId)
        {
            var testRequestService = new TestRequestService();
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
        [Route("api/testrequest/service/{serviceId:int}")]
        public async Task<IActionResult> GetTestRequestsByServiceId(int serviceId)
        {
            var testRequestService = new TestRequestService();
            try
            {
                var testRequest = await testRequestService.GetTestRequestsByServiceIdAsync(serviceId);
                return Ok(testRequest);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("api/testrequest")]
        public async Task<IActionResult> CreateTestRequest([FromBody] TestRequestDto testRequestDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var testRequestService = new TestRequestService();
            var testRequest = await testRequestService.CreateTestRequestAsync(testRequestDto);
            return CreatedAtAction(nameof(GetTestRequest), new { requestId = testRequest.RequestId }, testRequest);
        }
        [HttpDelete]
        [Route("api/testrequest/{requestId:int}")]
        public async Task<IActionResult> DeleteTestRequest(int requestId)
        {
            var testRequestService = new TestRequestService();
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
        [Route("api/testrequest/{requestId:int}")]
        public async Task<IActionResult> UpdateTestRequest(int requestId, [FromBody] TestRequestDto updateTestRequestDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var testRequestService = new TestRequestService();
            try
            {
                return Ok(await testRequestService.UpdateTestRequestAsync(requestId, updateTestRequestDto));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
