namespace UniStay.Application.Modules.Account.TwoFactor.Commands.SendCode;

public sealed class SendTwoFactorCodeCommand : IRequest<Unit>
{
    public string? ChallengeId { get; set; }
}
