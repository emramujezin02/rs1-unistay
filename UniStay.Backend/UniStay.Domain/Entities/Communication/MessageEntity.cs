using UniStay.Domain.Common;
using UniStay.Domain.Entities.Identity;

namespace UniStay.Domain.Entities.Communication;

public sealed class MessageEntity : BaseEntity
{
    public string? Subject { get; set; }
    public string MessageText { get; set; } = string.Empty;
    public DateTime SentAtUtc { get; set; }
    public bool IsRead { get; set; }

    public int SenderUserId { get; set; }
    public UniStayUserEntity SenderUser { get; set; } = null!;

    public int ReceiverUserId { get; set; }
    public UniStayUserEntity ReceiverUser { get; set; } = null!;
}
