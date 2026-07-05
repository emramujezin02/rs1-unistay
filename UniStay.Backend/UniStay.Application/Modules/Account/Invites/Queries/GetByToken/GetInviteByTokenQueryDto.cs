namespace UniStay.Application.Modules.Account.Invites.Queries.GetByToken;

public sealed class GetInviteByTokenQueryDto
{
    public string Email { get; set; } = string.Empty;
    public DateTime ExpiresAtUtc { get; set; }
    public bool IsExpired { get; set; }
    public bool Used { get; set; }
}
