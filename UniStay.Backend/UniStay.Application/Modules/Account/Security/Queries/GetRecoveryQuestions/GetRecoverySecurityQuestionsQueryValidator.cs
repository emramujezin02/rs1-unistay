namespace UniStay.Application.Modules.Account.Security.Queries.GetRecoveryQuestions;

public sealed class GetRecoverySecurityQuestionsQueryValidator : AbstractValidator<GetRecoverySecurityQuestionsQuery>
{
    public GetRecoverySecurityQuestionsQueryValidator()
    {
        RuleFor(x => x.RecoveryContextId).NotEmpty().MaximumLength(256);
    }
}
