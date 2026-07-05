namespace UniStay.Application.Modules.Account.TwoFactor.Commands.Disable;

public sealed class DisableTwoFactorCommand : IRequest<Unit>
{
    public int UserId { get; set; }
}
