namespace UniStay.Application.Modules.Account.Password.Commands.Reset;

public sealed class ResetPasswordCommand : IRequest<Unit>
{
    public required string Token { get; set; }
    public required string NewPassword { get; set; }
}
