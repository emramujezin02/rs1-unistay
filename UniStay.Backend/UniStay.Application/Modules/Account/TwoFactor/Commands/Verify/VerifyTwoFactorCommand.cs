using UniStay.Application.Modules.Auth.Commands.Login;

namespace UniStay.Application.Modules.Account.TwoFactor.Commands.Verify;

public sealed class VerifyTwoFactorCommand : IRequest<LoginCommandDto>
{
    public int UserId { get; set; }
    public required string Code { get; set; }
    public bool RememberMe { get; set; }
    public string? Fingerprint { get; set; }
}
