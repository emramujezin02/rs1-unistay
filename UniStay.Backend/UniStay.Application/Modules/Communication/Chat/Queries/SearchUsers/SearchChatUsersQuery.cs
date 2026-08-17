namespace UniStay.Application.Modules.Communication.Chat.Queries.SearchUsers;

public sealed class SearchChatUsersQuery : IRequest<IReadOnlyList<SearchChatUsersQueryDto>>
{
    public required string Username { get; set; }
    public int? ExcludeUserId { get; set; }
}
