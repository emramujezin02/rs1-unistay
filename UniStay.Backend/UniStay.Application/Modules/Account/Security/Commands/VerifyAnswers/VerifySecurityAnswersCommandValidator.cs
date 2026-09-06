namespace UniStay.Application.Modules.Account.Security.Commands.VerifyAnswers;

public sealed class VerifySecurityAnswersCommandValidator : AbstractValidator<VerifySecurityAnswersCommand>
{
    public VerifySecurityAnswersCommandValidator()
    {
        RuleFor(x => x.RecoveryContextId).MaximumLength(256);
    }
}
