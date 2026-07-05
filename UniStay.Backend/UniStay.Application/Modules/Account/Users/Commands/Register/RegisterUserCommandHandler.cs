using UniStay.Application.Modules.Account.Users.Common;

namespace UniStay.Application.Modules.Account.Users.Commands.Register;

public sealed class RegisterUserCommandHandler(IAppDbContext context, IPasswordHasher<UniStayUserEntity> hasher)
    : IRequestHandler<RegisterUserCommand, RegisterUserResult>
{
    public async Task<RegisterUserResult> Handle(RegisterUserCommand request, CancellationToken ct)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var username = request.Username.Trim();
        var normalizedUsername = username.ToLowerInvariant();

        if (await context.Users.AnyAsync(x => x.Email.ToLower() == email, ct))
            throw new UniStayConflictException("Email is already in use.");

        if (await context.Users.AnyAsync(x => x.Username.ToLower() == normalizedUsername, ct))
            throw new UniStayConflictException("Username is already in use.");

        var user = new UniStayUserEntity
        {
            Email = email,
            Username = username,
            Firstname = request.FirstName.Trim(),
            Lastname = request.LastName.Trim(),
            Phone = string.Empty,
            ProfileImage = string.Empty,
            IsEnabled = true
        };

        UserRoleMapper.ApplyRole(user, UserRoleMapper.StudentRoleId);
        user.PasswordHash = hasher.HashPassword(user, request.Password);

        context.Users.Add(user);
        await context.SaveChangesAsync(ct);

        return new RegisterUserResult(
            user.Id,
            user.Email,
            user.Username,
            user.Firstname,
            user.Lastname,
            "Student");
    }
}
