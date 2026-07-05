namespace UniStay.Application.Modules.Account.Security.Queries.GetAnswered;

public sealed class GetAnsweredSecurityQuestionsQueryValidator : AbstractValidator<GetAnsweredSecurityQuestionsQuery>
{
    public GetAnsweredSecurityQuestionsQueryValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
    }
}
