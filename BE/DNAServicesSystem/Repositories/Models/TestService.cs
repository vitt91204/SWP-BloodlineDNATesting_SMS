using System;
using System.Collections.Generic;

namespace Repositories.Models;

public partial class TestService
{
    public int ServiceId { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public decimal? Price { get; set; }

    public bool? IsActive { get; set; }

    public int KitId { get; set; }

    public virtual TestKit Kit { get; set; } = null!;

    public virtual ICollection<TestRequest> TestRequests { get; set; } = new List<TestRequest>();
}
