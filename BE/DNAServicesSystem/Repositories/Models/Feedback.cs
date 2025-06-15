using System;
using System.Collections.Generic;

namespace Repositories.Models;

public partial class Feedback
{
    public int FeedbackId { get; set; }

    public int UserId { get; set; }

    public int RequestId { get; set; }

    public int? Rating { get; set; }

    public string? Comment { get; set; }

    public string? Response { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? RespondedAt { get; set; }

    public virtual TestRequest Request { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
