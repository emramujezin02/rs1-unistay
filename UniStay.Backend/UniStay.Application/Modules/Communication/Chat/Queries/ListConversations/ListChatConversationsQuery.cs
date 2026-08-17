namespace UniStay.Application.Modules.Communication.Chat.Queries.ListConversations;

public sealed class ListChatConversationsQuery : IRequest<IReadOnlyList<ListChatConversationsQueryDto>>
{
    public int UserId { get; set; }
}
