namespace UniStay.Application.Modules.Account.Invites.Commands.Send;

public sealed class SendInviteCommandHandler(
    IAppDbContext context,
    IEmailService emailService,
    TimeProvider timeProvider)
    : IRequestHandler<SendInviteCommand, SendInviteCommandDto>
{
    public async Task<SendInviteCommandDto> Handle(SendInviteCommand request, CancellationToken ct)
    {
        var email = request.Email.Trim();
        var token = Guid.NewGuid().ToString();

        var invite = new InviteTokenEntity
        {
            Email = email,
            TokenHash = token,
            ExpiresAtUtc = timeProvider.GetUtcNow().AddDays(1).UtcDateTime,
            Used = false
        };

        context.InviteTokens.Add(invite);

        await context.SaveChangesAsync(ct);
        await emailService.SendInviteAsync(email, token, ct);

        return new SendInviteCommandDto
        {
            Message = "Invite sent successfully"
        };
    }
}
