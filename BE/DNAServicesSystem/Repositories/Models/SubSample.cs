using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Models
{
    public partial class SubSample
    {
        public int subSampleId { get; set; }
        public string? Name { get; set; }
        public int SampleId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        // Navigation property
        public virtual Sample Sample { get; set; }
    }
}
