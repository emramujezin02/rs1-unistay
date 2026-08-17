namespace UniStay.Application.Modules.Account.Password.Commands.Reset;

public sealed class ResetPasswordCommandHandler(
    IAppDbContext context,
    ISecurityTokenService tokenService,
    IPasswordHasher<UniStayUserEntity> hasher,
    TimeProvider timeProvider)
    : IRequestHandler<ResetPasswordCommand, Unit>
{
    public async Task<Unit> Handle(ResetPasswordCommand request, CancellationToken ct)
    {
        var tokenHash = tokenService.Hash(request.Token);
        var resetToken = await context.PasswordResetTokens
            .Include(x => x.User)
            .FirstOrDefaultAsync(x => x.TokenHash == tokenHash && !x.Used, ct);

        if (resetToken is null || resetToken.ExpiresAtUtc < timeProvider.GetUtcNow().UtcDateTime)
            throw new UniStayBusinessRuleException("INVALID_RESET_TOKEN", "Invalid or expired token.");

        resetToken.User.PasswordHash = hasher.HashPassword(resetToken.User, request.NewPassword);
        resetToken.Used = true;
        resetToken.User.TokenVersion++;

        await context.SaveChangesAsync(ct);
        return Unit.Value;
    }
}
