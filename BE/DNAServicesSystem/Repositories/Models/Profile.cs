using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Repositories.Models;

public partial class Profile
{
    public int ProfileId { get; set; }

    public int UserId { get; set; }

    public string? FullName { get; set; }

    public DateOnly? DateOfBirth { get; set; }

    public string? Gender { get; set; }

    public string? Address { get; set; }
    [JsonIgnore]
    public virtual User User { get; set; } = null!;
}
