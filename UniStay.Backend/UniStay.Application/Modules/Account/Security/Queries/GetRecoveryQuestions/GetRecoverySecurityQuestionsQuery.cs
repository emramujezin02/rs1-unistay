namespace UniStay.Application.Modules.Account.Security.Queries.GetRecoveryQuestions;

public sealed class GetRecoverySecurityQuestionsQuery : IRequest<IReadOnlyList<GetRecoverySecurityQuestionsQueryDto>>
{
    public required string RecoveryContextId { get; set; }
}
