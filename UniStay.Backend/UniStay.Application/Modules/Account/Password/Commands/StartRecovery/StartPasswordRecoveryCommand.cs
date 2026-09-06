namespace UniStay.Application.Modules.Account.Password.Commands.StartRecovery;

public sealed class StartPasswordRecoveryCommand : IRequest<StartPasswordRecoveryCommandDto>
{
    public required string Email { get; set; }
}
