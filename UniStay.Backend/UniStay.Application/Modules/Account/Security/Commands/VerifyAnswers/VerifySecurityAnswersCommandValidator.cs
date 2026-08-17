namespace UniStay.Application.Modules.Account.Security.Commands.VerifyAnswers;

public sealed class VerifySecurityAnswersCommandValidator : AbstractValidator<VerifySecurityAnswersCommand>
{
    public VerifySecurityAnswersCommandValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Answers).NotEmpty();
        RuleForEach(x => x.Answers).ChildRules(a =>
        {
            a.RuleFor(x => x.QuestionId).GreaterThan(0);
            a.RuleFor(x => x.Answer).NotEmpty();
        });
    }
}
