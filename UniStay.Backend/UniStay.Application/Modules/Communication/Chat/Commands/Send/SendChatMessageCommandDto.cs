namespace UniStay.Application.Modules.Communication.Chat.Commands.Send;

public sealed class SendChatMessageCommandDto
{
    public int Id { get; set; }
    public int SenderId { get; set; }
    public string SenderName { get; set; } = string.Empty;
    public int ReceiverId { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime SentAtUtc { get; set; }
}
