using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Models
{
    public partial class Address
    {
        public int addressId { get; set; }
        public int userId { get; set; }
        
        public string label { get; set; } = string.Empty;

        public string addressLine { get; set; } = string.Empty;
        public string city { get; set; } = string.Empty;
        public string province { get; set; } = string.Empty;
        public string postalCode { get; set; } = string.Empty;
        public string country { get; set; } = string.Empty;

        public bool isPrimary { get; set; }
        public DateTime createdAt { get; set; }
        
    }
}
