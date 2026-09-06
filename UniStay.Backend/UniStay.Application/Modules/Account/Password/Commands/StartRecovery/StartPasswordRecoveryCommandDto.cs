namespace UniStay.Application.Modules.Account.Password.Commands.StartRecovery;

public sealed class StartPasswordRecoveryCommandDto
{
    public required string Message { get; set; }
    public required string RecoveryContextId { get; set; }
}
