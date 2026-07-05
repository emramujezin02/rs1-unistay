using UniStay.Domain.Common;
using UniStay.Domain.Entities.Identity;

namespace UniStay.Domain.Entities.Notifications;

public sealed class NotificationEntity : BaseEntity
{
    public int UserId { get; set; }
    public UniStayUserEntity? User { get; set; }

    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public bool IsRead { get; set; }

    public static class Constraints
    {
        public const int TitleMaxLength = 200;
        public const int MessageMaxLength = 500;
        public const int TypeMaxLength = 100;
    }
}
