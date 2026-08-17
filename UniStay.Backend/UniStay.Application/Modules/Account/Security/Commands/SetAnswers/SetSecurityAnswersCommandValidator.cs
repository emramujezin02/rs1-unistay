namespace UniStay.Application.Modules.Account.Security.Commands.SetAnswers;

public sealed class SetSecurityAnswersCommandValidator : AbstractValidator<SetSecurityAnswersCommand>
{
    public SetSecurityAnswersCommandValidator()
    {
        RuleFor(x => x.UserId).GreaterThan(0);
        RuleFor(x => x.Answers).NotEmpty();
        RuleForEach(x => x.Answers).ChildRules(a =>
        {
            a.RuleFor(x => x.QuestionId).GreaterThan(0);
            a.RuleFor(x => x.Answer).NotEmpty().MinimumLength(2).MaximumLength(500);
        });
    }
}
