namespace UniStay.Application.Modules.Account.TwoFactor.Commands.Disable;

public sealed class DisableTwoFactorCommandHandler(IAppDbContext context, IAppCurrentUser currentUser)
    : IRequestHandler<DisableTwoFactorCommand, Unit>
{
    public async Task<Unit> Handle(DisableTwoFactorCommand request, CancellationToken ct)
    {
        var userId = currentUser.UserId ?? throw new UniStayConflictException("Current user is required.");

        var setting = await context.TwoFactorSettings.FirstOrDefaultAsync(x => x.UserId == userId, ct)
            ?? throw new UniStayNotFoundException("Two-factor settings not found.");

        setting.IsEnabled = false;
        setting.RequiresTwoFactor = false;
        setting.EnabledAtUtc = null;
        await context.SaveChangesAsync(ct);
        return Unit.Value;
    }
}
