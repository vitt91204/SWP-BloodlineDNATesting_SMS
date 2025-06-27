using Microsoft.AspNetCore.Mvc;
using Services;
using Services.ProfileDTO;
using Repositories.Models;

namespace DNAServicesSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly ProfileService profileService;

        public ProfileController(ProfileService profileService)
        {
            this.profileService = profileService;
        }

        [HttpGet("{userId:int}")]
        public async Task<IActionResult> GetProfile(int userId)
        {
            var profile = await profileService.GetProfileByUserIdAsync(userId);
            if (profile == null)
                return NotFound();
            return Ok(profile);
        }

        [HttpPost]
        public async Task<IActionResult> CreateProfile([FromBody] CreateProfileRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var created = await profileService.CreateProfileAsync(request);
            return CreatedAtAction(nameof(GetProfile), new { userId = created.UserId }, created);
        }

        [HttpPut("{userId:int}")]
        public async Task<IActionResult> UpdateProfile(int userId, [FromBody] UpdateProfileRequest updateProfileRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var profile = await profileService.UpdateProfileAsync(userId, updateProfileRequest);
                return Ok(profile);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}