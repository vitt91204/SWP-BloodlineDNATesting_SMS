using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Models
{
    public partial class TestKit
    {
        public int kitId { get; set; }  
        public string? kitName { get; set; }
        public string? description { get; set; }

        public int? stock { get; set; }
        public bool? isActive { get; set; }
    }
}
