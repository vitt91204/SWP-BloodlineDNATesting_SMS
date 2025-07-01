using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.UserDTO
{
    public class UpdateUserRequest
    {
        [Required]
        [StringLength(50, MinimumLength = 3)]
        public string Username { get; set; } = string.Empty;

        [EmailAddress]
        [StringLength(100)]
        public string? Email { get; set; }

        [Phone]
        [StringLength(20)]
        public string? Phone { get; set; }

        [StringLength(20)]
        public string? Role { get; set; }

        [StringLength(100)]
        public string? Fullname { get; set; }

        public DateOnly? DateOfBirth { get; set; }

        public string? Gender { get; set; }

    }
}
