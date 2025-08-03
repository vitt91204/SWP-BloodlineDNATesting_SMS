﻿using System;
using System.Collections.Generic;

namespace Repositories.Models;

public partial class BlogPost
{
    public int PostId { get; set; }

    public string? Title { get; set; }

    public string? Content { get; set; }

    public int? AuthorId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public string? PostImage { get; set; }

    public virtual User? Author { get; set; }
}
