using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.AddressDTO
{
    public class CreateAddressRequest
    {


        [StringLength(50)]
        public string? Label { get; set; }

        [Required]
        [StringLength(200)]
        public string AddressLine { get; set; } = null!;

        [StringLength(100)]
        public string? City { get; set; }

        [StringLength(100)]
        public string? Province { get; set; }

        [StringLength(20)]
        public string? PostalCode { get; set; }

        [StringLength(100)]
        public string? Country { get; set; }

        public bool? IsPrimary { get; set; }
    }
}

