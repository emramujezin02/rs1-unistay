namespace UniStay.Application.Modules.Account.TwoFactor.Commands.Enable;

public sealed class EnableTwoFactorCommand : IRequest<EnableTwoFactorCommandDto>
{
    public int UserId { get; set; }
}
