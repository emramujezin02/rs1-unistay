namespace UniStay.Application.Modules.Communication.Chat.Queries.ListConversations;

public sealed class ListChatConversationsQueryHandler(IAppDbContext context, IAppCurrentUser currentUser)
    : IRequestHandler<ListChatConversationsQuery, IReadOnlyList<ListChatConversationsQueryDto>>
{
    public async Task<IReadOnlyList<ListChatConversationsQueryDto>> Handle(ListChatConversationsQuery request, CancellationToken ct)
    {
        var callerId = currentUser.UserId
            ?? throw new UnauthorizedAccessException("You must be logged in.");

        if (request.UserId != callerId)
            throw new UnauthorizedAccessException("You can view only your own conversations.");

        var userExists = await context.Users.AnyAsync(x => x.Id == request.UserId, ct);
        if (!userExists)
            throw new UniStayNotFoundException("User not found.");

        var messages = await context.Messages
            .AsNoTracking()
            .Include(x => x.SenderUser)
            .Include(x => x.ReceiverUser)
            .Where(x => x.SenderUserId == request.UserId || x.ReceiverUserId == request.UserId)
            .OrderByDescending(x => x.SentAtUtc)
            .ToListAsync(ct);

        return messages
            .Select(x => new
            {
                OtherUserId = x.SenderUserId == request.UserId ? x.ReceiverUserId : x.SenderUserId,
                OtherUser = x.SenderUserId == request.UserId ? x.ReceiverUser : x.SenderUser,
                x.MessageText,
                x.SentAtUtc
            })
            .GroupBy(x => x.OtherUserId)
            .Select(g =>
            {
                var latest = g.First();
                return new ListChatConversationsQueryDto
                {
                    UserId = latest.OtherUserId,
                    DisplayName = UserDisplayName(latest.OtherUser),
                    LastMessage = latest.MessageText,
                    LastMessageAtUtc = latest.SentAtUtc
                };
            })
            .OrderByDescending(x => x.LastMessageAtUtc)
            .ToList();
    }

    private static string UserDisplayName(UniStayUserEntity user)
    {
        var fullName = $"{user.Firstname} {user.Lastname}".Trim();
        return string.IsNullOrWhiteSpace(fullName) ? user.Email : fullName;
    }
}
