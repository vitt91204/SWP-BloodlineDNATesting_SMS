using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.TestRequestDTO
{
    public class RequestTestDto
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        public int ServiceId { get; set; }

        [Required(AllowEmptyStrings = false)]
        [StringLength(50)]
        public string CollectionType { get; set; } = string.Empty;

        [Required(AllowEmptyStrings = false)]
        [StringLength(50)]
        public string Status { get; set; } = string.Empty;
        public int? StaffId { get; set; }
    }
}
