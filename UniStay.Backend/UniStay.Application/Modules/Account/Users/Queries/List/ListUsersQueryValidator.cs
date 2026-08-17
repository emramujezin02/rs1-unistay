using UniStay.Application.Modules.Account.Users.Common;

namespace UniStay.Application.Modules.Account.Users.Queries.List;

public sealed class ListUsersQueryValidator : AbstractValidator<ListUsersQuery>
{
    public ListUsersQueryValidator()
    {
        RuleFor(x => x.RoleId)
            .Must(roleId => roleId is null || UserRoleMapper.IsSupportedRole(roleId.Value))
            .WithMessage("RoleId must be one of: 1 Admin, 2 Student, 3 Employee, 4 Manager.");

        RuleFor(x => x.Role)
            .Must(role => string.IsNullOrWhiteSpace(role) || role.Trim().ToLowerInvariant() is "admin" or "student" or "employee" or "staff" or "manager")
            .WithMessage("Role must be one of: admin, student, employee, staff, manager.");
    }
}
