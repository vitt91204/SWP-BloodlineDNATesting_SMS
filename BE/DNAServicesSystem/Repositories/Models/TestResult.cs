using System;
using System.Collections.Generic;

namespace Repositories.Models;

public partial class TestResult
{
    public int ResultId { get; set; }

    public int SampleId { get; set; }

    public int? RequestId { get; set; }

    public int? UploadedBy { get; set; }

    public int? ApprovedBy { get; set; }

    public DateTime? UploadedTime { get; set; }

    public DateTime? ApprovedTime { get; set; }

    public int? StaffId { get; set; }

    public int? ResultDataId { get; set; }

    public virtual User? ApprovedByNavigation { get; set; }

    public virtual TestRequest? Request { get; set; }

    public virtual ResultDatum? ResultData { get; set; }

    public virtual Sample Sample { get; set; } = null!;

    public virtual User? Staff { get; set; }

    public virtual User? UploadedByNavigation { get; set; }
}
