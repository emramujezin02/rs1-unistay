namespace UniStay.Application.Modules.Account.TwoFactor.Commands.SendCode;

public sealed class SendTwoFactorCodeCommandHandler(
    IAppDbContext context,
    ISecurityTokenService tokenService,
    IEmailService emailService,
    TimeProvider timeProvider,
    IAppCurrentUser currentUser)
    : IRequestHandler<SendTwoFactorCodeCommand, Unit>
{
    public async Task<Unit> Handle(SendTwoFactorCodeCommand request, CancellationToken ct)
    {
        var now = timeProvider.GetUtcNow().UtcDateTime;
        DateTime expiresAtUtc;
        int userId;

        if (!string.IsNullOrWhiteSpace(request.ChallengeId))
        {
            var challengeHash = tokenService.Hash(request.ChallengeId);

            var challenge = await context.TwoFactorLoginChallenges
                .FirstOrDefaultAsync(x => x.ChallengeHash == challengeHash, ct)
                ?? throw new UniStayConflictException("Invalid or expired two-factor challenge.");

            if (challenge.Consumed || challenge.ExpiresAtUtc < now || challenge.FailedAttempts >= challenge.MaxAttempts)
                throw new UniStayConflictException("Invalid or expired two-factor challenge.");

            userId = challenge.UserId;
            expiresAtUtc = challenge.ExpiresAtUtc;
        }
        else
        {
            userId = currentUser.UserId ?? throw new UniStayConflictException("Current user or two-factor challenge is required.");
            expiresAtUtc = now.AddMinutes(10);
        }

        var user = await context.Users.FirstOrDefaultAsync(x => x.Id == userId, ct)
            ?? throw new UniStayNotFoundException("User not found.");

        var code = tokenService.GenerateNumericCode(6);
        context.TwoFactorCodes.Add(new TwoFactorCodeEntity
        {
            UserId = user.Id,
            CodeHash = tokenService.Hash(code),
            ExpiresAtUtc = expiresAtUtc,
            Used = false
        });

        await context.SaveChangesAsync(ct);
        await emailService.SendEmailAsync(user.Email, "Your 2FA Code", $"Your verification code is: <b>{code}</b>.", ct);
        return Unit.Value;
    }
}
