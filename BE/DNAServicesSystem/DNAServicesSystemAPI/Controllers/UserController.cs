using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services;
using Services.UserDTO;

namespace DNAServicesSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserService userService;
        public UserController(UserService userService)
        {
            this.userService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await userService.GetUsersAsync();
            return Ok(users);
        }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest createUserRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = await userService.CreateUserAsynce(createUserRequest);
            return Ok(user);
        }

        [HttpDelete]
        [Route("{userId:int}")]
        public async Task<IActionResult> DeleteUser(int userId)
        {
            try
            {
                await userService.DeleteUserAsync(userId);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }
        [HttpPut]
        [Route("{userId:int}")]
        public async Task<IActionResult> UpdateUser(int userId, [FromBody] CreateUserRequest updateUserRequest)
        {
            var user = await userService.UpdateUserAsync(userId, updateUserRequest);
            return Ok(user);
        }

        [HttpPost("login")]

        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = await userService.GetUserByUsernameAndPasswordAsync(loginRequest.Username, loginRequest.Password);
            if (user == null)
            {
                return Unauthorized("Invalid username or password.");
            }
            return Ok(user);
        }
    }
}
