using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.TestKitDTO
{
    public class TestKitDto
    {
        // KitId is typically not set by the client for create/update, so it's omitted

        [Required(AllowEmptyStrings = false)]
        [StringLength(100, MinimumLength = 2)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "StockQuantity must be zero or a positive number.")]
        public int StockQuantity { get; set; }

        [Required]
        public bool IsActive { get; set; }

        [Required]
        [Range(1, byte.MaxValue, ErrorMessage = "ServiceType must be a valid byte value.")]
        public byte ServiceType { get; set; } = 1;
    }
}
