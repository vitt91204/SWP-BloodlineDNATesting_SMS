using System;
using System.ComponentModel.DataAnnotations;

namespace Services.SubSampleDTO
{
    public class SubSampleDto
    {
        [Required]
        public int SampleId { get; set; }

        [StringLength(200)]
        public string? Description { get; set; }

        public DateTime? CreatedAt { get; set; }
    }
}