namespace UniStay.Application.Modules.Account.Security.Queries.ListQuestions;

public sealed class ListSecurityQuestionsQueryDto
{
    public int QuestionId { get; set; }
    public string Question { get; set; } = string.Empty;
}
