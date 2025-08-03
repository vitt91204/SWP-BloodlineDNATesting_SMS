using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services;
using Services.TestServiceDTO;

namespace DNAServicesSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestServiceController : ControllerBase
    {
        private readonly TestServiceService testServiceService;
        public TestServiceController(TestServiceService testServiceService)
        {
            this.testServiceService = testServiceService;
        }

        [HttpGet]
        public async Task<IActionResult> GetTestingServices()
        {
            var services = await testServiceService.GetAllTestingServicesAsync();
            return Ok(services);
        }

        [HttpGet("{serviceId:int}")]
        public async Task<IActionResult> GetTestingServiceById(int serviceId)
        {
            var service = await testServiceService.GetTestingServiceByIdAsync(serviceId);
            if (service == null)
            {
                return NotFound($"Testing service with ID {serviceId} not found.");
            }
            return Ok(service);
        }

        [HttpPost]
        [Route("kit/{kitId:int}")]
        public async Task<IActionResult> CreateTestingService(int kitId, [FromBody] TestServiceDto testServiceDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var createdService = await testServiceService.CreateTestingServiceAsync(kitId, testServiceDto);
            return CreatedAtAction(nameof(GetTestingServiceById), new { serviceId = createdService.ServiceId }, createdService);
        }

        [HttpDelete("{serviceId:int}")]
        public async Task<IActionResult> DeleteTestingService(int serviceId)
        {
            try
            {
                await testServiceService.DeleteTestingServiceAsync(serviceId);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }
        [HttpPut("{serviceId:int}")]
        public async Task<IActionResult> UpdateTestingService(int kitId, int serviceId, [FromBody] TestServiceDto testServiceDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var updatedService = await testServiceService.UpdateTestingServiceAsync(kitId, serviceId, testServiceDto);
            if (updatedService == null)
            {
                return NotFound($"Testing service with ID {serviceId} not found.");
            }
            return Ok(updatedService);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateTestingServiceStatus(int serviceId, bool isActive)
        {
            try
            {
                var updatedService = await testServiceService.UpdateStatusAsync(serviceId, isActive);
                return Ok(updatedService);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
