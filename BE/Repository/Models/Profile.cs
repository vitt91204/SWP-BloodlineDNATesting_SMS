using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Models
{
    public partial class Profile
    {
        public int profileId { get; set; }
        public int userId { get; set; }
        public string fullName { get; set; } = string.Empty;  
        public DateTime dateOfBirth { get; set; }
        public string address { get; set; } = string.Empty;
        public bool gender { get; set; }
    }
}
