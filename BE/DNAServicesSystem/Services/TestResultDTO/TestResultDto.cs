using System;
using System.ComponentModel.DataAnnotations;

namespace Services.TestResultDTO
{
    public class TestResultDto
    {
        public int ResultId { get; set; }

        [Required]
        public int SampleId { get; set; }

        [StringLength(500)]
        public string? ResultData { get; set; }

        public int? UploadedBy { get; set; }
        public int? ApprovedBy { get; set; }
        public DateTime? UploadedTime { get; set; }
        public DateTime? ApprovedTime { get; set; }
        public int? StaffId { get; set; }
    }
}