namespace UniStay.Application.Modules.Account.TwoFactor.Commands.Verify;

public sealed class VerifyTwoFactorCommandValidator : AbstractValidator<VerifyTwoFactorCommand>
{
    public VerifyTwoFactorCommandValidator()
    {
        RuleFor(x => x.UserId).GreaterThan(0);
        RuleFor(x => x.Code).NotEmpty().MinimumLength(4).MaximumLength(100);
        RuleFor(x => x.Fingerprint).MaximumLength(256).When(x => x.Fingerprint is not null);
    }
}
