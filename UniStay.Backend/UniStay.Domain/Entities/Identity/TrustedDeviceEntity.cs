using UniStay.Domain.Common;

namespace UniStay.Domain.Entities.Identity;

public sealed class TrustedDeviceEntity : BaseEntity
{
    public int UserId { get; set; }
    public UniStayUserEntity User { get; set; } = null!;
    public string TokenHash { get; set; } = string.Empty;
    public DateTime ExpiresAtUtc { get; set; }
}
