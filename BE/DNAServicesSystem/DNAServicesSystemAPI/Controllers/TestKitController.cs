using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services;
using Services.TestKitDTO;

namespace DNAServicesSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestKitController : ControllerBase
    {
        private readonly TestKitService testKitService;
        public TestKitController(TestKitService testKitService)
        {
            this.testKitService = testKitService;
        }
        [HttpGet("{name}")]
        public async Task<IActionResult> GetTestKitByName(string name)
        {
            var testKit = await testKitService.GetTestKitByNameAsync(name);
            if (testKit == null)
            {
                return NotFound($"Test kit with name '{name}' not found.");
            }
            return Ok(testKit);
        }
        [HttpGet("{kitId:int}")]
        public async Task<IActionResult> GetTestKitById(int kitId)
        {
            var testKit = await testKitService.GetTestKitByIdAsync(kitId);
            if (testKit == null)
            {
                return NotFound($"Test kit with ID '{kitId}' not found.");
            }
            return Ok(testKit);
        }
        [HttpGet]
        public async Task<IActionResult> GetAllTestKits()
        {
            var testKits = await testKitService.GetAllTestKitsAsync();
            return Ok(testKits);
        }
        [HttpPost]
        public async Task<IActionResult> CreateTestKit([FromBody] TestKitDto testKitDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var createdTestKit = await testKitService.CreateTestKitAsync(testKitDto);
            return CreatedAtAction(nameof(GetTestKitById), new { kitId = createdTestKit.KitId }, createdTestKit);
        }
        [HttpPut("{kitId:int}")]
        public async Task<IActionResult> UpdateTestKit(int kitId, [FromBody] TestKitDto testKitDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var updatedTestKit = await testKitService.UpdateTestKitAsync(kitId, testKitDto);
            if (updatedTestKit == null)
            {
                return NotFound($"Test kit with ID '{kitId}' not found.");
            }
            return Ok(updatedTestKit);
        }
        [HttpDelete("{kitId:int}")]
        public async Task<IActionResult> DeleteTestKit(int kitId)
        {
            try
            {
                await testKitService.DeleteTestKitAsync(kitId);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
