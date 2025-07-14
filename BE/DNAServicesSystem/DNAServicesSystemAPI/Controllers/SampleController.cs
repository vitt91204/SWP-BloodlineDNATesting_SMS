using Microsoft.AspNetCore.Mvc;
using Services;
using Services.SampleDTO;
using Repositories;
using System.Linq;
using Microsoft.Extensions.DependencyInjection; 

namespace DNAServicesSystemAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SampleController : ControllerBase
    {
        private readonly SampleService _service;
        public SampleController(SampleService service) { _service = service; }

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
        public async Task<IActionResult> Create([FromBody] SampleDto dto)
        {
            var id = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id }, dto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] SampleDto dto)
        {
            var updated = await _service.UpdateAsync(id, dto);
            if (!updated) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }

        [HttpGet("GetSampleByName")]
        public async Task<IActionResult> SearchSamplesAsync([FromQuery] string? serviceName, [FromQuery] string? userFullName)
        {
            var result = await _service.SearchSamplesAsync(serviceName, userFullName);
            return Ok(result);
        }

        [HttpGet("{sampleId}/result-pdf")]
        public async Task<IActionResult> GetSampleResultPdf(
    int sampleId,
    [FromServices] TestResultRepository testResultRepository)
        {
            var result = await testResultRepository.GetByIdAsync(sampleId);
            if (result == null || string.IsNullOrEmpty(result.ResultData))
                return NotFound("PDF not found for this sample.");

            try
            {
                var pdfBytes = Convert.FromBase64String(result.ResultData);
                return File(pdfBytes, "application/pdf", $"Sample_{sampleId}_Result.pdf");
            }
            catch
            {
                return BadRequest("Stored data is not a valid PDF file.");
            }
        }
    }
}