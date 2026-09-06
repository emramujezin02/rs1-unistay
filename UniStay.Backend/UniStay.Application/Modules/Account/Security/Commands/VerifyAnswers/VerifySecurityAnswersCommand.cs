using UniStay.Application.Modules.Account.Security.Common;

namespace UniStay.Application.Modules.Account.Security.Commands.VerifyAnswers;

public sealed class VerifySecurityAnswersCommand : IRequest<VerifySecurityAnswersCommandDto>
{
    public string RecoveryContextId { get; set; } = string.Empty;
    public List<SecurityAnswerDto> Answers { get; set; } = new();
}
