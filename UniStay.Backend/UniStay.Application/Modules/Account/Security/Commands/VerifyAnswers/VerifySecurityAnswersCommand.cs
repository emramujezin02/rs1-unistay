using UniStay.Application.Modules.Account.Security.Common;

namespace UniStay.Application.Modules.Account.Security.Commands.VerifyAnswers;

public sealed class VerifySecurityAnswersCommand : IRequest<VerifySecurityAnswersCommandDto>
{
    public required string Email { get; set; }
    public List<SecurityAnswerDto> Answers { get; set; } = new();
}
