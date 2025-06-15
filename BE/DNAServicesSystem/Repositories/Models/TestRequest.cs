using Microsoft.Extensions.FileSystemGlobbing.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Models
{
    public partial class TestRequest
    {
        public int requestId { get; set; }
        public int userId { get; set; }
        
        public string collecttionType { get; set; }

        public string status { get; set; }

        public DateOnly appointmentDate { get; set; }
        public TimeOnly appointmentTime { get; set; }

        public DateTime createdAt { get; set; }

        public DateTime updatedAt { get; set; }

        public int staffId { get; set; }

        public Payment payment { get; set; } = new Payment();

        public virtual ICollection<Sample> samples { get; set; } = new List<Sample>();

        public TestService service { get; set; } = new TestService();
        public TestResult TestResult { get; set; } = new TestResult();
        public Feedback? feedback { get; set; }
    }
}
