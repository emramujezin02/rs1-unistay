namespace UniStay.Application.Modules.Account.Security.Queries.GetRecoveryQuestions;

public sealed class GetRecoverySecurityQuestionsQueryDto
{
    public int QuestionId { get; set; }
    public string Question { get; set; } = string.Empty;
}
