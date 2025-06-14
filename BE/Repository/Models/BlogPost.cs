using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Models
{
    public partial class BlogPost
    {
        public int postId { get; set; }
        public int userId { get; set; }

        public string title { get; set; } = string.Empty;
        public string content { get; set; } = string.Empty;

        public DateTime createdAt { get; set; }
        public DateTime? updatedAt { get; set; } = null;
        public bool isPublished { get; set; } = false;
    }
}
