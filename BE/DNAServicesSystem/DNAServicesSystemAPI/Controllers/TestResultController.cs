using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Services;
using Services.TestResultDTO;
using Repositories;
using Repositories.Models;
using System.IO;
using System.Threading.Tasks;
using Repositories.Base;

namespace DNAServicesSystemAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestResultController : ControllerBase
    {
        private readonly TestResultService _service;
        private readonly TestResultRepository _testResultRepository;

        public TestResultController(TestResultService service, TestResultRepository testResultRepository)
        {
            _service = service;
            _testResultRepository = testResultRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TestResultDto dto)
        {
            var id = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id }, dto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] TestResultDto dto)
        {
            var updated = await _service.UpdateAsync(id, dto);
            if (!updated) return NotFound();
            return NoContent();
        }

        [HttpPost("{id}/upload-pdf")]
        public async Task<IActionResult> UploadPdf(int id, IFormFile file)
        {
            if (file == null)
                return BadRequest("No file uploaded.");

            var result = await _service.UploadPdfAsync(id, file);
            if (!result)
                return BadRequest("Failed to upload or save PDF.");

            return Ok("PDF uploaded and saved successfully.");
        }

        [HttpGet("{id}/view-pdf")]
        public async Task<IActionResult> ViewPdf(int id)
        {
            // Get the TestResult entity
            var entity = await _testResultRepository.GetByIdAsync(id);
            if (entity == null || string.IsNullOrEmpty(entity.ResultData))
                return NotFound("PDF not found for this result.");

            try
            {
                // Decode the Base64 string to byte array
                var pdfBytes = Convert.FromBase64String(entity.ResultData);

                // Return the PDF file (browser will try to open it)
                return File(pdfBytes, "application/pdf");
            }
            catch
            {
                return BadRequest("Stored data is not a valid PDF file.");
            }
        }

    }
}

// Dependency injection configuration
public static class ServiceExtensions
{
    public static void AddRepositories(this IServiceCollection services)
    {
        services.AddScoped<TestResultRepository>();
    }
}