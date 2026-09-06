using System.ComponentModel.DataAnnotations;

namespace UniStay.Shared.Options;

public sealed class TwoFactorOptions
{
    public const string SectionName = "TwoFactor";

    [Range(1, 60)] public int ChallengeMinutes { get; init; } = 10;
    [Range(1, 10)] public int MaxVerifyAttempts { get; init; } = 5;
    public string[] DevelopmentDemoBypassEmails { get; init; } = [];
}
