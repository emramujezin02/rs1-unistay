namespace UniStay.Application.Modules.Account.TwoFactor.Commands.SendCode;

public sealed class SendTwoFactorCodeCommandValidator : AbstractValidator<SendTwoFactorCodeCommand>
{
    public SendTwoFactorCodeCommandValidator()
    {
        RuleFor(x => x.UserId).GreaterThan(0);
    }
}
