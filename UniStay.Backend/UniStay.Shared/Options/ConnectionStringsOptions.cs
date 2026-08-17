using System.ComponentModel.DataAnnotations;

namespace UniStay.Shared.Options;

/// <summary>"ConnectionStrings" section.</summary>
public sealed class ConnectionStringsOptions
{
    public const string SectionName = "ConnectionStrings";

    [Required] public string Main { get; init; } = default!;
}