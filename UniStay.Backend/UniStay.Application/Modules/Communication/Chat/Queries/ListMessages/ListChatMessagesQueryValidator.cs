namespace UniStay.Application.Modules.Communication.Chat.Queries.ListMessages;

public sealed class ListChatMessagesQueryValidator : AbstractValidator<ListChatMessagesQuery>
{
    public ListChatMessagesQueryValidator()
    {
        RuleFor(x => x.UserId).GreaterThan(0);
        RuleFor(x => x.OtherUserId).GreaterThan(0);
        RuleFor(x => x.OtherUserId).NotEqual(x => x.UserId);
    }
}
