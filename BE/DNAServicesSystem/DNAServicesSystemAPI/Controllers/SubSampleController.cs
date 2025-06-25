using Microsoft.AspNetCore.Mvc;
using Services;
using Services.SubSampleDTO;

namespace DNAServicesSystemAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SubSampleController : ControllerBase
    {
        private readonly SubSampleService _service;
        public SubSampleController(SubSampleService service) { _service = service; }

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
        public async Task<IActionResult> Create([FromBody] SubSampleDto dto)
        {
            var id = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id }, dto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] SubSampleDto dto)
        {
            var updated = await _service.UpdateAsync(id, dto);
            if (!updated) return NotFound();
            return NoContent();
        }
    }
}