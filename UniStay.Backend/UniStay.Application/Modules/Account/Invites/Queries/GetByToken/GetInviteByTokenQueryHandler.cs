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

        if (invite.Used)
            throw new UniStayConflictException("Invite token has already been used.");

        if (invite.ExpiresAtUtc <= now)
            throw new UniStayConflictException("Invite token has expired.");

        return new GetInviteByTokenQueryDto
        {
            Email = invite.Email,
            ExpiresAtUtc = invite.ExpiresAtUtc,
            IsExpired = false,
            Used = false
        };
    }
}
