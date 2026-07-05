namespace UniStay.Application.Modules.Account.Invites.Queries.GetByToken;

public sealed class GetInviteByTokenQueryHandler(
    IAppDbContext context,
    ISecurityTokenService tokenService,
    TimeProvider timeProvider)
    : IRequestHandler<GetInviteByTokenQuery, GetInviteByTokenQueryDto>
{
    public async Task<GetInviteByTokenQueryDto> Handle(GetInviteByTokenQuery request, CancellationToken ct)
    {
        var tokenHash = tokenService.Hash(request.Token.Trim());
        var invite = await context.InviteTokens
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.TokenHash == tokenHash, ct)
            ?? throw new UniStayNotFoundException("Invite token not found.");

        var now = timeProvider.GetUtcNow().UtcDateTime;

        return new GetInviteByTokenQueryDto
        {
            Email = invite.Email,
            ExpiresAtUtc = invite.ExpiresAtUtc,
            IsExpired = invite.ExpiresAtUtc <= now,
            Used = invite.Used
        };
    }
}
