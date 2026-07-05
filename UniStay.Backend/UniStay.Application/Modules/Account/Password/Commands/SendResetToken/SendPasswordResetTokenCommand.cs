namespace UniStay.Application.Modules.Account.Password.Commands.SendResetToken;

public sealed class SendPasswordResetTokenCommand : IRequest<Unit>
{
    public required string Email { get; set; }
}
