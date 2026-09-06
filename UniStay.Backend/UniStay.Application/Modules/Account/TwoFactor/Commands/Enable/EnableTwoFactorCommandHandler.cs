namespace UniStay.Application.Modules.Account.TwoFactor.Commands.Enable;

public sealed class EnableTwoFactorCommandHandler(IAppDbContext context, ISecurityTokenService tokenService, TimeProvider timeProvider, IAppCurrentUser currentUser)
    : IRequestHandler<EnableTwoFactorCommand, EnableTwoFactorCommandDto>
{
    public async Task<EnableTwoFactorCommandDto> Handle(EnableTwoFactorCommand request, CancellationToken ct)
    {
        var userId = currentUser.UserId ?? throw new UniStayConflictException("Current user is required.");

        var userExists = await context.Users.AnyAsync(x => x.Id == userId, ct);
        if (!userExists)
            throw new UniStayNotFoundException("User not found.");

        var setting = await context.TwoFactorSettings.FirstOrDefaultAsync(x => x.UserId == userId, ct);
        if (setting is null)
            context.TwoFactorSettings.Add(new TwoFactorSettingEntity { UserId = userId, IsEnabled = true, RequiresTwoFactor = true, EnabledAtUtc =
                timeProvider.GetUtcNow().UtcDateTime, Method = "email" });

        else
        {
            setting.IsEnabled = true;
            setting.RequiresTwoFactor = true;
            setting.EnabledAtUtc = timeProvider.GetUtcNow().UtcDateTime;
            setting.Method = "email";
        }

        var oldCodes = context.BackupCodes.Where(x => x.UserId == userId);
        context.BackupCodes.RemoveRange(oldCodes);

        var plain = new List<string>();
        for (var i = 0; i < 8; i++)
        {
            var code = Guid.NewGuid().ToString("N")[..8].ToUpperInvariant();
            plain.Add(code);
            context.BackupCodes.Add(new BackupCodeEntity { UserId = userId, CodeHash = tokenService.Hash(code), Used = false });
        }

        await context.SaveChangesAsync(ct);
        return new EnableTwoFactorCommandDto { BackupCodes = plain };
    }
}
