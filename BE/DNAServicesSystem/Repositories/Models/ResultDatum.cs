using System;
using System.Collections.Generic;

namespace Repositories.Models;

public partial class ResultDatum
{
    public int ResultDataId { get; set; }

    public string? FileName { get; set; }

    public string? FileData { get; set; }

    public virtual ICollection<TestResult> TestResults { get; set; } = new List<TestResult>();
}
