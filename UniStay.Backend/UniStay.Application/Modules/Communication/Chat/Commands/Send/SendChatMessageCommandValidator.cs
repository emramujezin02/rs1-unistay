namespace UniStay.Application.Modules.Communication.Chat.Commands.Send;

public sealed class SendChatMessageCommandValidator : AbstractValidator<SendChatMessageCommand>
{
    public SendChatMessageCommandValidator()
    {
        RuleFor(x => x.SenderUserId).GreaterThan(0);
        RuleFor(x => x.ReceiverUserId).GreaterThan(0);
        RuleFor(x => x.Subject).MaximumLength(200);
        RuleFor(x => x.MessageText).NotEmpty().MaximumLength(4000);
    }
}
