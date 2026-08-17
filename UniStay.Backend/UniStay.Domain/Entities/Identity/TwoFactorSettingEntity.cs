using UniStay.Domain.Common;

namespace UniStay.Domain.Entities.Identity;

public sealed class TwoFactorSettingEntity : BaseEntity
{
    public int UserId { get; set; }
    public UniStayUserEntity User { get; set; } = null!;
    public bool IsEnabled { get; set; }
    public DateTime? EnabledAtUtc { get; set; }
    public string Method { get; set; } = "email";
    public bool RequiresTwoFactor { get; set; }
}
