using Repositories.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.TestRequestDTO
{
    public class RequestDetailsDto
    {
        public string UserFullName { get; set; } = string.Empty;
        public string ServiceName { get; set; } = string.Empty;


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
        public DateOnly? AppointmentDate { get; set; }

        [Required]
        public TimeOnly? SlotTime { get; set; }

        public int? StaffId { get; set; }

        public Sample? Sample { get; set; }
        public List<SubSample>? SubSamples { get; set; }
    }
}
