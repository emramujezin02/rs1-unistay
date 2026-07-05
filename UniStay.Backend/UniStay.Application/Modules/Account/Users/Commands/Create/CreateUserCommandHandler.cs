using UniStay.Application.Modules.Account.Users.Common;

namespace UniStay.Application.Modules.Account.Users.Commands.Create;

public sealed class CreateUserCommandHandler(
    IAppDbContext context,
    IPasswordHasher<UniStayUserEntity> hasher,
    IAppCurrentUser currentUser)
    : IRequestHandler<CreateUserCommand, int>
{
    public async Task<int> Handle(CreateUserCommand request, CancellationToken ct)
    {
        if (!currentUser.IsAdmin)
            throw new UnauthorizedAccessException("Only admins can create users.");

        var email = request.Email.Trim().ToLowerInvariant();
        var username = string.IsNullOrWhiteSpace(request.Username)
            ? request.FirstName.Trim()
            : request.Username.Trim();

        if (await context.Users.AnyAsync(x => x.Email.ToLower() == email, ct))
            throw new UniStayConflictException("Email is already in use.");

        if (await context.Users.AnyAsync(x => x.Username.ToLower() == username.ToLower(), ct))
            throw new UniStayConflictException("Username is already in use.");

        var user = new UniStayUserEntity
        {
            Email = email,
            Firstname = request.FirstName.Trim(),
            Lastname = request.LastName.Trim(),
            Phone = request.Phone.Trim(),
            DateOfBirth = request.DateOfBirth,
            Username = username,
            ProfileImage = request.ProfileImage?.Trim() ?? string.Empty,
            IsEnabled = true
        };

        UserRoleMapper.ApplyRole(user, request.RoleId);
        user.PasswordHash = hasher.HashPassword(user, request.Password);

        context.Users.Add(user);
        await context.SaveChangesAsync(ct);

        return user.Id;
    }
}
