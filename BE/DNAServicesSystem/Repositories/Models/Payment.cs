using System;
using System.Collections.Generic;

namespace Repositories.Models;

public partial class Payment
{
    public int PaymentId { get; set; }

    public int RequestId { get; set; }

    public string Method { get; set; } = null!;

    public decimal Amount { get; set; }

    public string? Status { get; set; }

    public DateTime? PaidAt { get; set; }

    public virtual TestRequest Request { get; set; } = null!;
}
