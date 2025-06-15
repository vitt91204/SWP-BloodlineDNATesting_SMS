using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Models
{
    public partial class TestResult
    {
        public int resultId { get; set; }
        public int requestId { get; set; }

        public int sampleId { get; set; }
        public string? result { get; set; } 

        public int uploadedBy { get; set; }

        public int approvedBy { get; set; }

        public DateTime uploadTime { get; set; }
        public DateTime approvedTime { get; set; }
        public int staffId { get; set; }
    }
}
