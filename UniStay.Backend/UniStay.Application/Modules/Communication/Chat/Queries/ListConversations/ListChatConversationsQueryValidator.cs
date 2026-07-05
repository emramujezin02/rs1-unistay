namespace UniStay.Application.Modules.Communication.Chat.Queries.ListConversations;

public sealed class ListChatConversationsQueryValidator : AbstractValidator<ListChatConversationsQuery>
{
    public ListChatConversationsQueryValidator()
    {
        RuleFor(x => x.UserId).GreaterThan(0);
    }
}
