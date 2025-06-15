using System.ComponentModel.DataAnnotations;

namespace Services.UserDTO
{
    public class CreateUserRequest
    {
        [Required]
        [StringLength(50, MinimumLength = 3)]
        public string Username { get; set; } = null!;

        [Required]
        [StringLength(100, MinimumLength = 8)]
        public string Password { get; set; } = null!;

        [EmailAddress]
        [StringLength(100)]
        public string? Email { get; set; }

        [Phone]
        [StringLength(20)]
        public string? Phone { get; set; }

        [StringLength(20)]
        public string? Role { get; set; }
    }
}