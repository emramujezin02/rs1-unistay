namespace UniStay.Application.Modules.Account.Invites.Queries.GetByToken;

public sealed class GetInviteByTokenQuery : IRequest<GetInviteByTokenQueryDto>
{
    public string Token { get; set; } = string.Empty;
}
