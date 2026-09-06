namespace UniStay.Application.Modules.Account.Password.Commands.StartRecovery;

public sealed class StartPasswordRecoveryCommandHandler(
    IAppDbContext context,
    ISecurityTokenService tokenService,
    TimeProvider timeProvider)
    : IRequestHandler<StartPasswordRecoveryCommand, StartPasswordRecoveryCommandDto>
{
    private const string PublicMessage = "If security-question recovery can continue, the next step will be shown.";

    public async Task<StartPasswordRecoveryCommandDto> Handle(StartPasswordRecoveryCommand request, CancellationToken ct)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var user = await context.Users.FirstOrDefaultAsync(x => x.Email.ToLower() == email, ct);
        var recoveryContextId = tokenService.GenerateSecureToken(32);

        if (user is not null)
        {
            context.PasswordRecoveryContexts.Add(new PasswordRecoveryContextEntity
            {
                UserId = user.Id,
                ContextHash = tokenService.Hash(recoveryContextId),
                ExpiresAtUtc = timeProvider.GetUtcNow().AddMinutes(15).UtcDateTime,
                FailedAttempts = 0,
                MaxAttempts = 5,
                Consumed = false
            });

            await context.SaveChangesAsync(ct);
        }

        return new StartPasswordRecoveryCommandDto
        {
            Message = PublicMessage,
            RecoveryContextId = recoveryContextId
        };
    }
}
