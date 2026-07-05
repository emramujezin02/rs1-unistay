namespace UniStay.Application.Modules.Account.TwoFactor.Commands.Disable;

public sealed class DisableTwoFactorCommandHandler(IAppDbContext context)
    : IRequestHandler<DisableTwoFactorCommand, Unit>
{
    public async Task<Unit> Handle(DisableTwoFactorCommand request, CancellationToken ct)
    {
        var setting = await context.TwoFactorSettings.FirstOrDefaultAsync(x => x.UserId == request.UserId, ct)
            ?? throw new UniStayNotFoundException("Two-factor settings not found.");

        setting.IsEnabled = false;
        setting.RequiresTwoFactor = false;
        setting.EnabledAtUtc = null;
        await context.SaveChangesAsync(ct);
        return Unit.Value;
    }
}
