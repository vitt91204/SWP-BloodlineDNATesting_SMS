using System;
using System.ComponentModel.DataAnnotations;
using Services.Attributes;

namespace Services.TestRequestDTO
{
    public class TestRequestDto
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

        [Required]
        public DateOnly AppointmentDate { get; set; }

        [Required]
        public TimeOnly SlotTime { get; set; }

        public int? StaffId { get; set; }
    }
}