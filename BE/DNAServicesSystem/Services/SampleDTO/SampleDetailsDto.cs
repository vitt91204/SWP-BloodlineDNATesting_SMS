using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.SampleDTO
{
    public class SampleDetailsDto
    {
        public int SampleId { get; set; }
        public string? UserFullName { get; set; }
        public string? ServiceName { get; set; }
        [Phone]
        public string? UserPhoneNumber { get; set; }

        [Required]
        public int RequestId { get; set; }
        [Required]
        public int CollectedBy { get; set; }
        public DateTime? ReceivedTime { get; set; }

        [Required(AllowEmptyStrings = false)]
        [StringLength(50)]
        public string? Status { get; set; }
        public string? SampleType { get; set; }
    }
}
