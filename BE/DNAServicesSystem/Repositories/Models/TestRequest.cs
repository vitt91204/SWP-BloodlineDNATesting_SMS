using System;
using System.Collections.Generic;

namespace Repositories.Models;

public partial class TestRequest
{
    public int RequestId { get; set; }

    public int UserId { get; set; }

    public int ServiceId { get; set; }

    public string? CollectionType { get; set; }

    public string? Status { get; set; }

    public DateOnly? AppointmentDate { get; set; }

    public TimeOnly? SlotTime { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? StaffId { get; set; }

    public int? AddressId { get; set; }

    public virtual Address? Address { get; set; }

    public virtual ICollection<Feedback> Feedbacks { get; set; } = new List<Feedback>();

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

    public virtual ICollection<Sample> Samples { get; set; } = new List<Sample>();

    public virtual TestService Service { get; set; } = null!;

    public virtual User? Staff { get; set; }

    public virtual User User { get; set; } = null!;
}
