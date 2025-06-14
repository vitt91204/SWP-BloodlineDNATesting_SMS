using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Models
{
    public partial class Notification
    {
        public int notificationId { get; set; }
        public int userId { get; set; }
        public string message { get; set; } = string.Empty;
        public DateTime createdAt { get; set; }
        public bool isRead { get; set; } = false;
        public User User { get; set; } = null!; // Navigation property to User
    }
}
