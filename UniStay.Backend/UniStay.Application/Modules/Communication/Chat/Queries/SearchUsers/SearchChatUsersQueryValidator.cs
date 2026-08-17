namespace UniStay.Application.Modules.Communication.Chat.Queries.SearchUsers;

public sealed class SearchChatUsersQueryValidator : AbstractValidator<SearchChatUsersQuery>
{
    public SearchChatUsersQueryValidator()
    {
        RuleFor(x => x.Username).NotEmpty().MinimumLength(2).MaximumLength(100);
        RuleFor(x => x.ExcludeUserId).GreaterThan(0).When(x => x.ExcludeUserId.HasValue);
    }
}
