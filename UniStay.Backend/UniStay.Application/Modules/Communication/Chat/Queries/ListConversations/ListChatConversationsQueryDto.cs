namespace UniStay.Application.Modules.Communication.Chat.Queries.ListConversations;

public sealed class ListChatConversationsQueryDto
{
    public int UserId { get; set; }
    public string DisplayName { get; set; } = string.Empty;
    public string LastMessage { get; set; } = string.Empty;
    public DateTime LastMessageAtUtc { get; set; }
}
