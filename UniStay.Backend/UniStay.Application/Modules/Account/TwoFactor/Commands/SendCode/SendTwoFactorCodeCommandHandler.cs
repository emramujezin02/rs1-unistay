namespace UniStay.Application.Modules.Account.TwoFactor.Commands.SendCode;

public sealed class SendTwoFactorCodeCommandHandler(IAppDbContext context, ISecurityTokenService tokenService, IEmailService emailService, TimeProvider timeProvider)
    : IRequestHandler<SendTwoFactorCodeCommand, Unit>
{
    public async Task<Unit> Handle(SendTwoFactorCodeCommand request, CancellationToken ct)
    {
        var user = await context.Users.FirstOrDefaultAsync(x => x.Id == request.UserId, ct)
            ?? throw new UniStayNotFoundException("User not found.");

        var code = tokenService.GenerateNumericCode(6);
        context.TwoFactorCodes.Add(new TwoFactorCodeEntity
        {
            UserId = user.Id,
            CodeHash = tokenService.Hash(code),
            ExpiresAtUtc = timeProvider.GetUtcNow().AddMinutes(10).UtcDateTime,
            Used = false
        });

        await context.SaveChangesAsync(ct);
        await emailService.SendEmailAsync(user.Email, "Your 2FA Code", $"Your verification code is: <b>{code}</b>.", ct);
        return Unit.Value;
    }
}
