using System;
using System.Collections.Generic;

namespace Repositories.Models;

public partial class Sample
{
    public int SampleId { get; set; }

    public int RequestId { get; set; }

    public int CollectedBy { get; set; }

    public DateTime? ReceivedTime { get; set; }

    public string? Status { get; set; }

    public string? SampleType { get; set; }

    public virtual User CollectedByNavigation { get; set; } = null!;

    public virtual TestRequest Request { get; set; } = null!;

    public virtual ICollection<SubSample> SubSamples { get; set; } = new List<SubSample>();

    public virtual ICollection<TestResult> TestResults { get; set; } = new List<TestResult>();
}
