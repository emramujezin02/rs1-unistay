namespace UniStay.Application.Modules.Account.Invites.Queries.GetByToken;

public sealed class GetInviteByTokenQueryValidator : AbstractValidator<GetInviteByTokenQuery>
{
    public GetInviteByTokenQueryValidator()
    {
        RuleFor(x => x.Token)
            .NotEmpty()
            .MaximumLength(512);
    }
}
