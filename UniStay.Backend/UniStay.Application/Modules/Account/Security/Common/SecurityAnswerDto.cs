namespace UniStay.Application.Modules.Account.Security.Common;

public sealed class SecurityAnswerDto
{
    public int QuestionId { get; set; }
    public string Answer { get; set; } = string.Empty;
}
