namespace UniStay.Application.Modules.Notifications.Commands.SaveFcmToken;

public sealed class SaveFcmTokenCommandHandler(
    IAppDbContext context,
    IAppCurrentUser currentUser)
    : IRequestHandler<SaveFcmTokenCommand>
{
    public async Task Handle(SaveFcmTokenCommand request, CancellationToken ct)
    {
        if (currentUser.UserId is null)
            return;

        var user = await context.Users
            .FirstOrDefaultAsync(x => x.Id == currentUser.UserId.Value, ct);

        if (user is null)
            return;

        user.FcmToken = request.Token;
        await context.SaveChangesAsync(ct);
    }
}
