namespace UniStay.Application.Modules.Communication.Chat.Queries.ListMessages;

public sealed class ListChatMessagesQueryDto
{
    public int Id { get; set; }
    public int SenderId { get; set; }
    public string SenderName { get; set; } = string.Empty;
    public int ReceiverId { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime SentAtUtc { get; set; }
    public bool IsRead { get; set; }
}
