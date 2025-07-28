using System;
using System.ComponentModel.DataAnnotations;

namespace Services.TestRequestDTO
{
    public class AppointmentTestRequestDto : RequestTestDto
    {
        [Required]
        public DateOnly AppointmentDate { get; set; }
        [Required]
        public TimeOnly SlotTime { get; set; }
    }
}