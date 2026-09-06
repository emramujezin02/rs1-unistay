using UniStay.Domain.Common;

namespace UniStay.Domain.Entities.Identity;

public sealed class TwoFactorLoginChallengeEntity : BaseEntity
{
    public int UserId { get; set; }
    public UniStayUserEntity User { get; set; } = null!;
    public string ChallengeHash { get; set; } = string.Empty;
    public DateTime ExpiresAtUtc { get; set; }
    public int FailedAttempts { get; set; }
    public int MaxAttempts { get; set; } = 5;
    public bool Consumed { get; set; }
}
