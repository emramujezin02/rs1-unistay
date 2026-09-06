namespace UniStay.Application.Modules.Account.Password.Commands.SendResetToken;

public sealed class SendPasswordResetTokenCommandDto
{
    public required string Message { get; set; }
    public required string RecoveryContextId { get; set; }
}
