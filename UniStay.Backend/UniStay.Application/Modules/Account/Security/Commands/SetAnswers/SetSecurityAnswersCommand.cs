using UniStay.Application.Modules.Account.Security.Common;

namespace UniStay.Application.Modules.Account.Security.Commands.SetAnswers;

public sealed class SetSecurityAnswersCommand : IRequest<Unit>
{
    [JsonIgnore]
    public int UserId { get; set; }
    public List<SecurityAnswerDto> Answers { get; set; } = new();
}

