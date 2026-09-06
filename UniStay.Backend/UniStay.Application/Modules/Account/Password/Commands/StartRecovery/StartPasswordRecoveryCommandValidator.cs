namespace UniStay.Application.Modules.Account.Password.Commands.StartRecovery;

public sealed class StartPasswordRecoveryCommandValidator : AbstractValidator<StartPasswordRecoveryCommand>
{
    public StartPasswordRecoveryCommandValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
    }
}
