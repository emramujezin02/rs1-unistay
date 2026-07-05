using UniStay.Domain.Common;

namespace UniStay.Domain.Entities.Identity;

public sealed class InviteTokenEntity : BaseEntity
{
    public const int EmailMaxLength = 256;

    public string Email { get; set; } = string.Empty;
    public string TokenHash { get; set; } = string.Empty;
    public DateTime ExpiresAtUtc { get; set; }
    public bool Used { get; set; }
}
