using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.FeedbackDTO
{
    public class ResponseFeedback
    {
        public String? Response { get; set; }
        public DateTime? ResponseAt { get; set; } = DateTime.UtcNow;
    }
}
