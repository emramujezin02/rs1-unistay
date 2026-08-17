namespace UniStay.Application.Modules.Communication.Chat.Queries.SearchUsers;

public sealed class SearchChatUsersQueryHandler(IAppDbContext context)
    : IRequestHandler<SearchChatUsersQuery, IReadOnlyList<SearchChatUsersQueryDto>>
{
    public async Task<IReadOnlyList<SearchChatUsersQueryDto>> Handle(SearchChatUsersQuery request, CancellationToken ct)
    {
        var term = request.Username.Trim().ToLower();

        var query = context.Users
            .AsNoTracking()
            .Where(x => x.IsEnabled && (
                x.Email.ToLower().Contains(term) ||
                x.Firstname.ToLower().Contains(term) ||
                x.Lastname.ToLower().Contains(term)));

        if (request.ExcludeUserId.HasValue)
            query = query.Where(x => x.Id != request.ExcludeUserId.Value);

        var users = await query
            .OrderBy(x => x.Firstname)
            .ThenBy(x => x.Lastname)
            .Take(10)
            .ToListAsync(ct);

        return users
            .Select(x => new SearchChatUsersQueryDto
            {
                UserId = x.Id,
                DisplayName = UserDisplayName(x),
                Email = x.Email
            })
            .ToList();
    }

    private static string UserDisplayName(UniStayUserEntity user)
    {
        var fullName = $"{user.Firstname} {user.Lastname}".Trim();
        return string.IsNullOrWhiteSpace(fullName) ? user.Email : fullName;
    }
}
