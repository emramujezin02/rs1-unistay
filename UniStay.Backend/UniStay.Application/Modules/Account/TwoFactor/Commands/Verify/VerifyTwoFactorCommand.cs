using UniStay.Application.Modules.Auth.Commands.Login;

namespace UniStay.Application.Modules.Account.TwoFactor.Commands.Verify;

public sealed class VerifyTwoFactorCommand : IRequest<LoginCommandDto>
{
    public required string ChallengeId { get; set; }
    public required string Code { get; set; }
    public bool RememberMe { get; set; }
    public string? Fingerprint { get; set; }
}
