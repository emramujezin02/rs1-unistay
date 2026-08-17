namespace UniStay.Application.Modules.Communication.Chat.Queries.ListMessages;

public sealed class ListChatMessagesQuery : IRequest<IReadOnlyList<ListChatMessagesQueryDto>>
{
    public int UserId { get; set; }
    public int OtherUserId { get; set; }
}
