namespace UniStay.Application.Modules.Communication.Chat.Commands.Send;

public sealed class SendChatMessageCommand : IRequest<SendChatMessageCommandDto>
{
    public int SenderUserId { get; set; }
    public int ReceiverUserId { get; set; }
    public string? Subject { get; set; }
    public required string MessageText { get; set; }
}
