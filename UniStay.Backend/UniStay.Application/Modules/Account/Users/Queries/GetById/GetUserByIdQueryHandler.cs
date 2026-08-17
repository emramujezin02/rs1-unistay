using UniStay.Application.Modules.Account.Users.Common;

namespace UniStay.Application.Modules.Account.Users.Queries.GetById;

public sealed class GetUserByIdQueryHandler(
    IAppDbContext context,
    IAppCurrentUser currentUser)
    : IRequestHandler<GetUserByIdQuery, UserDto>
{
    public async Task<UserDto> Handle(GetUserByIdQuery request, CancellationToken ct)
    {
        var user = await context.Users
            .AsNoTracking()
            .Where(x => x.Id == request.Id)
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
            })
            .FirstOrDefaultAsync(ct);

        if (user is null)
            throw new UniStayNotFoundException($"User with Id {request.Id} not found.");

        var isOwnProfile = currentUser.UserId == user.Id;
        var canViewStudentRecord = currentUser.IsEmployee && user.RoleId == UserRoleMapper.StudentRoleId;

        if (!currentUser.IsAdmin && !isOwnProfile && !canViewStudentRecord)
            throw new UnauthorizedAccessException("Only admins can view user details. Employees can view student records only.");

        return user;
    }
}
