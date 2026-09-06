namespace UniStay.Application.Modules.Account.Password.Commands.SendResetToken;

public sealed class SendPasswordResetTokenCommandHandler(
    IAppDbContext context,
    ISecurityTokenService tokenService,
    IEmailService emailService,
    TimeProvider timeProvider)
    : IRequestHandler<SendPasswordResetTokenCommand, SendPasswordResetTokenCommandDto>
{
    private const string PublicMessage = "If an account with this email exists, password reset instructions have been sent.";

    public async Task<SendPasswordResetTokenCommandDto> Handle(SendPasswordResetTokenCommand request, CancellationToken ct)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var user = await context.Users.FirstOrDefaultAsync(x => x.Email.ToLower() == email, ct);
        var recoveryContextId = tokenService.GenerateSecureToken(32);
        if (user is null)
        {
            return new SendPasswordResetTokenCommandDto
            {
                Message = PublicMessage,
                RecoveryContextId = recoveryContextId
            };
        }

        var rawToken = tokenService.GenerateSecureToken(32);
        context.PasswordResetTokens.Add(new PasswordResetTokenEntity
        {
            UserId = user.Id,
            TokenHash = tokenService.Hash(rawToken),
            ExpiresAtUtc = timeProvider.GetUtcNow().AddHours(1).UtcDateTime,
            Used = false
        });

        await context.SaveChangesAsync(ct);
        await emailService.SendPasswordResetTokenAsync(user.Email, rawToken, ct);

        return new SendPasswordResetTokenCommandDto
        {
            Message = PublicMessage,
            RecoveryContextId = recoveryContextId
        };
    }
}
