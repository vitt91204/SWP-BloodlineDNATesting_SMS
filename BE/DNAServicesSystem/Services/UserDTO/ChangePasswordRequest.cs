using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.UserDTO
{
    public class ChangePasswordRequest
    {
        [Required]
        [StringLength(100, MinimumLength = 8)]
        public string OldPassword { get; set; } = string.Empty;
        [Required]
        [StringLength(100, MinimumLength = 8)]
        public string NewPassword { get; set; } = string.Empty;

        [Required]
        [StringLength(100, MinimumLength = 8)]
        [Compare("NewPassword", ErrorMessage = "Passwords do not match.")]
        public string RepeatPassword { get; set; } = string.Empty;

    }
}
