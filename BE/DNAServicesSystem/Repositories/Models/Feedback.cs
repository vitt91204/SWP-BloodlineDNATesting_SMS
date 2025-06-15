using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Models
{
    public partial class Feedback
    {
        public int feedbackId { get; set; }
        public int userId { get; set; }
        public int requestId { get; set; }
        public string message { get; set; } = string.Empty;
        public DateTime createdAt { get; set; }

        public int rating { get; set; }

        public string? response { get; set; } = string.Empty;
        public DateTime? responseTime { get; set; } = null;

    }
}
