namespace UniStay.Application.Modules.Communication.Chat.Commands.Send;

public sealed class SendChatMessageCommandHandler(IAppDbContext context, TimeProvider timeProvider)
    : IRequestHandler<SendChatMessageCommand, SendChatMessageCommandDto>
{
    public async Task<SendChatMessageCommandDto> Handle(SendChatMessageCommand request, CancellationToken ct)
    {
        if (request.SenderUserId == request.ReceiverUserId)
            throw new UniStayConflictException("Sender and receiver must be different users.");

        var sender = await context.Users
            .FirstOrDefaultAsync(x => x.Id == request.SenderUserId && x.IsEnabled, ct)
            ?? throw new UniStayNotFoundException("Sender user not found.");

        var receiverExists = await context.Users
            .AnyAsync(x => x.Id == request.ReceiverUserId && x.IsEnabled, ct);

        if (!receiverExists)
            throw new UniStayNotFoundException("Receiver user not found.");

        var message = new MessageEntity
        {
            SenderUserId = request.SenderUserId,
            ReceiverUserId = request.ReceiverUserId,
            Subject = string.IsNullOrWhiteSpace(request.Subject) ? null : request.Subject.Trim(),
            MessageText = request.MessageText.Trim(),
            SentAtUtc = timeProvider.GetUtcNow().UtcDateTime,
            IsRead = false
        };

        context.Messages.Add(message);
        await context.SaveChangesAsync(ct);

        return new SendChatMessageCommandDto
        {
            Id = message.Id,
            SenderId = sender.Id,
            SenderName = UserDisplayName(sender),
            ReceiverId = request.ReceiverUserId,
            Content = message.MessageText,
            SentAtUtc = message.SentAtUtc
        };
    }

    private static string UserDisplayName(UniStayUserEntity user)
    {
        var fullName = $"{user.Firstname} {user.Lastname}".Trim();
        return string.IsNullOrWhiteSpace(fullName) ? user.Email : fullName;
    }
}
