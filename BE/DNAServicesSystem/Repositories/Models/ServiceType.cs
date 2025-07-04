using System;
using System.Collections.Generic;

namespace Repositories.Models;

public partial class ServiceType
{
    public byte TypeId { get; set; }

    public string? TypeName { get; set; }

    public virtual ICollection<TestKit> TestKits { get; set; } = new List<TestKit>();
}
