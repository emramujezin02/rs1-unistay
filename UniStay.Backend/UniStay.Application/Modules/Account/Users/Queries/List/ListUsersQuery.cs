using UniStay.Application.Modules.Account.Users.Common;

namespace UniStay.Application.Modules.Account.Users.Queries.List;

public sealed class ListUsersQuery : BasePagedQuery<UserDto>
{
    public string? Q { get; init; }
    public string? SearchTerm { get; init; }
    public int? RoleId { get; init; }
    public string? Role { get; init; }
    public bool? IsEnabled { get; init; }
    public int? PageNumber { get; init; }
    public int? PageSize { get; init; }
}
