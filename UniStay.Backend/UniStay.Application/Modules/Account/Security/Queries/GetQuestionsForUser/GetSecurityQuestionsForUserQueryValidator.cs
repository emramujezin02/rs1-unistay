namespace UniStay.Application.Modules.Account.Security.Queries.GetQuestionsForUser;

public sealed class GetSecurityQuestionsForUserQueryValidator : AbstractValidator<GetSecurityQuestionsForUserQuery>
{
    public GetSecurityQuestionsForUserQueryValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
    }
}
