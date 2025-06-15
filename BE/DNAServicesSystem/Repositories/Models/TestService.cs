using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Models
{
    public partial class TestService
    {
        public int serviceId { get; set; }
        public string? serviceName { get; set; }

        public string? serviceDescription { get; set; }

        public float? price { get; set; }
        public bool? isActive { get; set; }

        public TestKit? testKit { get; set; }
    }
}
