namespace UniStay.Application.Modules.Account.TwoFactor.Commands.Disable;

public sealed class DisableTwoFactorCommandValidator : AbstractValidator<DisableTwoFactorCommand>
{
    public DisableTwoFactorCommandValidator()
    {
        RuleFor(x => x.UserId).GreaterThan(0);
    }
}
