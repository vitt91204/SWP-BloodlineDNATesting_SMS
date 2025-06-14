using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Models
{
    public partial class User
    {
        public int userId { get; set; }
        public string username { get; set; } = string.Empty;
        public string email { get; set; } = string.Empty;
        public string password { get; set; } = string.Empty;

        public string phoneNumber { get; set; } = string.Empty;

        public string role { get; set; } = "Customer"; // Default role is "Customer"
        public DateTime createdAt { get; set; }
        public DateTime? lastLogin { get; set; } = null;
        public bool isActive { get; set; } = true;

        public ICollection<Address> addresses { get; set; } = new List<Address>();
        public ICollection<BlogPost> blogPosts { get; set; } = new List<BlogPost>();
        public ICollection<Feedback> feedbacks { get; set; } = new List<Feedback>();
        public ICollection<TestRequest> requests { get; set; } = new List<TestRequest>();
        public ICollection<TestResult> results { get; set; } = new List<TestResult>();

        public ICollection<Notification> notifications { get; set; } = new List<Notification>();

        public ICollection<Sample> samples { get; set; } = new List<Sample>();

    }
}
