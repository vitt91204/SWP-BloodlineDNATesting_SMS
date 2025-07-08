using Microsoft.AspNetCore.Mvc;
using Services;
using Services.TestRequestDTO;

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
        public async Task<IActionResult> CreateTestRequest([FromBody] TestRequestDto testRequestDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var testRequest = await testRequestService.CreateTestRequestAsync(testRequestDto);
            return CreatedAtAction(nameof(GetTestRequest), new { requestId = testRequest.RequestId }, testRequest);
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
        public async Task<IActionResult> UpdateTestRequest(int requestId, [FromBody] TestRequestDto updateTestRequestDto)
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
    }
}
