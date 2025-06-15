using System;
using System.Collections.Generic;

namespace Repositories.Models;

public partial class Address
{
    public int AddressId { get; set; }

    public int UserId { get; set; }

    public string? Label { get; set; }

    public string AddressLine { get; set; } = null!;

    public string? City { get; set; }

    public string? Province { get; set; }

    public string? PostalCode { get; set; }

    public string? Country { get; set; }

    public bool? IsPrimary { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual User User { get; set; } = null!;
}
