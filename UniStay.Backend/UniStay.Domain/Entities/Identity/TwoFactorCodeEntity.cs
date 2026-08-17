using UniStay.Domain.Common;

namespace UniStay.Domain.Entities.Identity;

public sealed class TwoFactorCodeEntity : BaseEntity
{
    public int UserId { get; set; }
    public UniStayUserEntity User { get; set; } = null!;
    public string CodeHash { get; set; } = string.Empty;
    public DateTime ExpiresAtUtc { get; set; }
    public bool Used { get; set; }
}
