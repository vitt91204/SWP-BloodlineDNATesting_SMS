using Microsoft.AspNetCore.Mvc;
using Services;
using Services.BlogPostDTO;

namespace DNAServicesSystemAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BlogPostController : ControllerBase
    {
        private readonly BlogPostService _service;

        public BlogPostController(BlogPostService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var posts = await _service.GetAllAsync();
            return Ok(posts);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var post = await _service.GetByIdAsync(id);
            if (post == null) return NotFound();
            return Ok(post);
        }

        //[HttpPost]
        //public async Task<IActionResult> Create([FromBody] BlogPostDto dto)
        //{
        //    var id = await _service.CreateAsync(dto);
        //    return CreatedAtAction(nameof(GetById), new { id }, dto);
        //}

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] BlogPostDto dto)
        {
            var updated = await _service.UpdateAsync(id, dto);
            if (!updated)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }

        [HttpPost]
        public async Task<IActionResult> CreateBlogPost([FromForm] BlogPostDto dto)
        {
            var blogPost = await _service.CreateBlogPostAsync(dto);
            return Ok(blogPost);
        }

        [HttpGet("{id}/image")]
        public async Task<IActionResult> GetImage(int id)
        {
            var post = await _service.GetByIdAsync(id);
            if (post == null || string.IsNullOrEmpty(post.PostImage))
                return NotFound();

            byte[] imageBytes = Convert.FromBase64String(post.PostImage);
            return File(imageBytes, "image/jpeg");
        }
    }
}