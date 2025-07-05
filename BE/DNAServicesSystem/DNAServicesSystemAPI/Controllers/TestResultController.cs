using Microsoft.AspNetCore.Mvc;
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
        private readonly GenericRepository<ResultDatum> _resultDatumRepository;

        public TestResultController(TestResultService service, TestResultRepository testResultRepository, GenericRepository<ResultDatum> resultDatumRepository)
        {
            _service = service;
            _testResultRepository = testResultRepository;
            _resultDatumRepository = resultDatumRepository;
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

        [HttpPost("upload")]
        public async Task<IActionResult> UploadTestResult([FromForm] TestResultUploadDto dto)
        {
            if (dto.PdfFile == null || dto.PdfFile.Length == 0)
                return BadRequest("No file uploaded.");

            using var ms = new MemoryStream();
            await dto.PdfFile.CopyToAsync(ms);
            var fileBytes = ms.ToArray();
            var base64String = Convert.ToBase64String(fileBytes);

            var resultDatum = new ResultDatum
            {
                FileName = dto.PdfFile.FileName,
                FileData = base64String
            };
            await _resultDatumRepository.CreateAsync(resultDatum);

            var testResult = new TestResult
            {
                ResultDataId = resultDatum.ResultDataId,
                UploadedTime = DateTime.UtcNow
            };
            await _testResultRepository.CreateAsync(testResult);

            return Ok(new { testResult.ResultId, resultDatum.ResultDataId });
        }

        [HttpGet("resultdata/{id}")]
        public async Task<IActionResult> GetResultData(int id)
        {
            var resultDatum = await _resultDatumRepository.GetByIdAsync(id);
            if (resultDatum == null)
                return NotFound();

            return Ok(new
            {
                resultDatum.ResultDataId,
                resultDatum.FileName,
                resultDatum.FileData // This is the Base64 string
            });
        }
    }
}

// Dependency injection configuration
public static class ServiceExtensions
{
    public static void AddRepositories(this IServiceCollection services)
    {
        services.AddScoped<TestResultRepository>();
        services.AddScoped<GenericRepository<ResultDatum>>();
    }
}