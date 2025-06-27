using System;
using System.ComponentModel.DataAnnotations;

namespace Services.BlogPostDTO
{
    public class BlogPostDto
    {
        [Required]
        public int AuthorId { get; set; }

        [Required(AllowEmptyStrings = false)]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required(AllowEmptyStrings = false)]
        public string Content { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}