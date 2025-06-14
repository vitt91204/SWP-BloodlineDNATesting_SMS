using Microsoft.Identity.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Models
{
    public partial class Sample
    {
        public int sampleId { get; set; }

        public int requestId { get; set; }

        public int collector { get; set; }

        public DateTime collectTime { get; set; }
        public DateTime recievedTime { get; set; }

        public bool isActive { get; set; }
        // Navigation property
        public virtual ICollection<SubSample> SubSamples { get; set; } = new List<SubSample>();
    }
}
