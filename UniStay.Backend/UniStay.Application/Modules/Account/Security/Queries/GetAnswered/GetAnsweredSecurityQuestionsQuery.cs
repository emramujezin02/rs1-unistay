namespace UniStay.Application.Modules.Account.Security.Queries.GetAnswered;

public sealed class GetAnsweredSecurityQuestionsQuery : IRequest<IReadOnlyList<GetAnsweredSecurityQuestionsQueryDto>>
{
    public required string Email { get; set; }
}
