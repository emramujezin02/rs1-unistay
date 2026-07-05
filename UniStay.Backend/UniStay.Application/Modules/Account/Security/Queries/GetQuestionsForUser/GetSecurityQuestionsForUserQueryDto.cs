namespace UniStay.Application.Modules.Account.Security.Queries.GetQuestionsForUser;

public sealed class GetSecurityQuestionsForUserQueryDto
{
    public int QuestionId { get; set; }
    public string Question { get; set; } = string.Empty;
}
