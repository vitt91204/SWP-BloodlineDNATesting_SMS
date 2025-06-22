using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.FeedbackDTO
{
    public class FeedbackDto
    {
        [Required]
        public int FeedbackId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public int RequestId { get; set; }

        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5.")]
        public int? Rating { get; set; }

        [StringLength(1000, ErrorMessage = "Comment cannot exceed 1000 characters.")]
        public string? Comment { get; set; }

        [StringLength(1000, ErrorMessage = "Response cannot exceed 1000 characters.")]
        public string? Response { get; set; }

        public DateTime? CreatedAt { get; set; }

        public DateTime? RespondedAt { get; set; }
    }
}
