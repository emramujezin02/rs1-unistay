namespace UniStay.Application.Modules.Account.Invites.Commands.Send;

public sealed class SendInviteCommand : IRequest<SendInviteCommandDto>
{
    public string Email { get; set; } = string.Empty;
}
