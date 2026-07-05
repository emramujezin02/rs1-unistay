namespace UniStay.Application.Modules.Account.Invites.Commands.Send;

public sealed class SendInviteCommandValidator : AbstractValidator<SendInviteCommand>
{
    public SendInviteCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress()
            .MaximumLength(InviteTokenEntity.EmailMaxLength);
    }
}
