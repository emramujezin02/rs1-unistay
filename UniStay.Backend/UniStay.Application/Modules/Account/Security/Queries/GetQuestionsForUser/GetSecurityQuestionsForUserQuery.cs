namespace UniStay.Application.Modules.Account.Security.Queries.GetQuestionsForUser;

public sealed class GetSecurityQuestionsForUserQuery : IRequest<IReadOnlyList<GetSecurityQuestionsForUserQueryDto>>
{
    public required string Email { get; set; }
}
