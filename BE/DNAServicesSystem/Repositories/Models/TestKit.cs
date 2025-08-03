using System;
using System.Collections.Generic;

namespace Repositories.Models;

public partial class TestKit
{
    public int KitId { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public int? StockQuantity { get; set; }

    public bool? IsActive { get; set; }

    public string? ServiceType { get; set; }

    public virtual ICollection<TestService> TestServices { get; set; } = new List<TestService>();
}
