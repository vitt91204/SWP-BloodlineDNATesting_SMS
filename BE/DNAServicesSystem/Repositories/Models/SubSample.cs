using System;
using System.Collections.Generic;

namespace Repositories.Models;

public partial class SubSample
{
    public int SubSampleId { get; set; }

    public int SampleId { get; set; }

    public string? Description { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Sample Sample { get; set; } = null!;
}
