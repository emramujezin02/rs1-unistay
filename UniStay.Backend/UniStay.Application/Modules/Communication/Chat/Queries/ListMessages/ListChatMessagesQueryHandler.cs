namespace UniStay.Application.Modules.Communication.Chat.Queries.ListMessages;

public sealed class ListChatMessagesQueryHandler(IAppDbContext context, IAppCurrentUser currentUser)
    : IRequestHandler<ListChatMessagesQuery, IReadOnlyList<ListChatMessagesQueryDto>>
{
    public async Task<IReadOnlyList<ListChatMessagesQueryDto>> Handle(ListChatMessagesQuery request, CancellationToken ct)
    {
        var callerId = currentUser.UserId
            ?? throw new UnauthorizedAccessException("You must be logged in.");

        if (request.UserId != callerId)
            throw new UnauthorizedAccessException("You can view only your own messages.");

        var messages = await context.Messages
            .AsNoTracking()
            .Include(x => x.SenderUser)
            .Where(x =>
                (x.SenderUserId == request.UserId && x.ReceiverUserId == request.OtherUserId) ||
                (x.SenderUserId == request.OtherUserId && x.ReceiverUserId == request.UserId))
            .OrderBy(x => x.SentAtUtc)
            .ToListAsync(ct);

        return messages
            .Select(x => new ListChatMessagesQueryDto
            {
                Id = x.Id,
                SenderId = x.SenderUserId,
                SenderName = UserDisplayName(x.SenderUser),
                ReceiverId = x.ReceiverUserId,
                Content = x.MessageText,
                SentAtUtc = x.SentAtUtc,
                IsRead = x.IsRead
            })
            .ToList();
    }

    private static string UserDisplayName(UniStayUserEntity user)
    {
        var fullName = $"{user.Firstname} {user.Lastname}".Trim();
        return string.IsNullOrWhiteSpace(fullName) ? user.Email : fullName;
    }
}
