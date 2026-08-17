using UniStay.Application.Modules.Account.Users.Common;

namespace UniStay.Application.Modules.Account.Users.Queries.List;

public sealed class ListUsersQueryHandler(
    IAppDbContext context,
    IAppCurrentUser currentUser)
    : IRequestHandler<ListUsersQuery, PageResult<UserDto>>
{
    public async Task<PageResult<UserDto>> Handle(ListUsersQuery request, CancellationToken ct)
    {
        var requestedRoleId = request.RoleId ?? MapRoleNameToId(request.Role);
        var searchTerm = request.Q ?? request.SearchTerm;
        var pageNumber = request.PageNumber.GetValueOrDefault(request.Paging.Page);
        var pageSize = request.PageSize.GetValueOrDefault(request.Paging.PageSize);
        pageNumber = pageNumber <= 0 ? 1 : pageNumber;
        pageSize = pageSize <= 0 ? 10 : Math.Min(pageSize, 10000);

        if (!currentUser.IsAdmin)
        {
            var canViewStudentRecords = currentUser.IsEmployee &&
                requestedRoleId == UserRoleMapper.StudentRoleId;

            if (!canViewStudentRecords)
                throw new UnauthorizedAccessException("Only admins can view users. Employees can view student records only.");
        }

        var query = context.Users.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var q = searchTerm.Trim();
            query = query.Where(x =>
                x.Firstname.Contains(q) ||
                x.Lastname.Contains(q) ||
                x.Username.Contains(q) ||
                x.Email.Contains(q) ||
                x.Phone.Contains(q));
        }

        if (requestedRoleId.HasValue)
        {
            query = requestedRoleId.Value switch
            {
                UserRoleMapper.AdminRoleId => query.Where(x => x.IsAdmin),
                UserRoleMapper.StudentRoleId => query.Where(x => x.IsStudent),
                UserRoleMapper.EmployeeRoleId => query.Where(x => x.IsEmployee),
                UserRoleMapper.ManagerRoleId => query.Where(x => x.IsManager),
                _ => query
            };
        }

        if (request.IsEnabled.HasValue)
            query = query.Where(x => x.IsEnabled == request.IsEnabled.Value);

        var projectedQuery = query
            .OrderBy(x => x.Firstname)
            .ThenBy(x => x.Lastname)
            .Select(x => new UserDto
            {
                Id = x.Id,
                UserID = x.Id,
                Email = x.Email,
                FirstName = x.Firstname,
                LastName = x.Lastname,
                Username = x.Username,
                Phone = x.Phone,
                DateOfBirth = x.DateOfBirth,
                ProfileImage = x.ProfileImage,
                RoleId = x.IsAdmin ? UserRoleMapper.AdminRoleId :
                    x.IsStudent ? UserRoleMapper.StudentRoleId :
                    x.IsEmployee ? UserRoleMapper.EmployeeRoleId :
                    x.IsManager ? UserRoleMapper.ManagerRoleId : null,
                Role = x.IsAdmin ? "Admin" :
                    x.IsStudent ? "Student" :
                    x.IsManager ? "Manager" :
                    x.IsEmployee ? "Employee" : "User",
                RoleName = x.IsAdmin ? "Admin" :
                    x.IsStudent ? "Student" :
                    x.IsManager ? "Manager" :
                    x.IsEmployee ? "Employee" : "User",
                IsEnabled = x.IsEnabled,
                CreatedAt = x.CreatedAtUtc,
                UpdatedAt = x.ModifiedAtUtc
            });

        var total = await projectedQuery.CountAsync(ct);
        var items = await projectedQuery
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return new PageResult<UserDto>
        {
            Items = items,
            PageSize = pageSize,
            CurrentPage = pageNumber,
            IncludedTotal = true,
            TotalItems = total,
            TotalPages = (int)Math.Ceiling(total / (double)pageSize)
        };
    }

    private static int? MapRoleNameToId(string? role)
    {
        if (string.IsNullOrWhiteSpace(role))
            return null;

        return role.Trim().ToLowerInvariant() switch
        {
            "admin" => UserRoleMapper.AdminRoleId,
            "student" => UserRoleMapper.StudentRoleId,
            "employee" or "staff" => UserRoleMapper.EmployeeRoleId,
            "manager" => UserRoleMapper.ManagerRoleId,
            _ => null
        };
    }
}
