namespace UniStay.Application.Modules.Communication.Chat.Queries.SearchUsers;

public sealed class SearchChatUsersQueryDto
{
    public int UserId { get; set; }
    public string DisplayName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}
