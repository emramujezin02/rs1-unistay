namespace UniStay.Application.Modules.Account.Security.Commands.VerifyAnswers;

public sealed class VerifySecurityAnswersCommandDto
{
    public bool Success { get; set; }
    public string? ResetToken { get; set; }
}
