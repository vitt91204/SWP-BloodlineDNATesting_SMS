using System;
using System.Collections.Generic;

namespace Repositories.Models;

public partial class User
{
    public int UserId { get; set; }

    public string Username { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string? Email { get; set; }

    public string? Phone { get; set; }

    public string? Role { get; set; }

    public string? FullName { get; set; }

    public DateOnly? DateOfBirth { get; set; }

    public string? Gender { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<Address> Addresses { get; set; } = new List<Address>();

    public virtual ICollection<BlogPost> BlogPosts { get; set; } = new List<BlogPost>();

    public virtual ICollection<Feedback> Feedbacks { get; set; } = new List<Feedback>();

    public virtual ICollection<Sample> Samples { get; set; } = new List<Sample>();

    public virtual ICollection<TestRequest> TestRequestStaffs { get; set; } = new List<TestRequest>();

    public virtual ICollection<TestRequest> TestRequestUsers { get; set; } = new List<TestRequest>();

    public virtual ICollection<TestResult> TestResultApprovedByNavigations { get; set; } = new List<TestResult>();

    public virtual ICollection<TestResult> TestResultStaffs { get; set; } = new List<TestResult>();

    public virtual ICollection<TestResult> TestResultUploadedByNavigations { get; set; } = new List<TestResult>();
}
