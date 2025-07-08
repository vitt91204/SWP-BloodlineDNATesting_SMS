using System;
using System.ComponentModel.DataAnnotations;

namespace Services.SampleDTO
{
    public class SampleDto
    {
        [Required]
        public int RequestId { get; set; }
        [Required]
        public int CollectedBy { get; set; }
        public DateTime? CollectionTime { get; set; }
        public DateTime? ReceivedTime { get; set; }

        [Required(AllowEmptyStrings = false)]
        [StringLength(50)]
        public string ? Status { get; set; } 
        public string ? Relationship { get; set; } 
        public string ? SampleType { get; set; }  
    }
}