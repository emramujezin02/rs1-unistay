using UniStay.Application.Modules.Account.Users.Common;

namespace UniStay.Application.Modules.Account.Users.Commands.Update;

public sealed class UpdateUserCommandHandler(
    IAppDbContext context,
    IPasswordHasher<UniStayUserEntity> hasher,
    IAppCurrentUser currentUser)
    : IRequestHandler<UpdateUserCommand, Unit>
{
    public async Task<Unit> Handle(UpdateUserCommand request, CancellationToken ct)
    {
        if (!currentUser.IsAdmin)
            throw new UnauthorizedAccessException("Only admins can update users.");

        var user = await context.Users
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct)
            ?? throw new UniStayNotFoundException($"User with Id {request.Id} not found.");

        if (!string.IsNullOrWhiteSpace(request.Email))
        {
            var email = request.Email.Trim().ToLowerInvariant();
            var emailExists = await context.Users
                .AnyAsync(x => x.Id != request.Id && x.Email.ToLower() == email, ct);

            if (emailExists)
                throw new UniStayConflictException("Email is already in use.");

            user.Email = email;
        }

        if (!string.IsNullOrWhiteSpace(request.Username))
        {
            var username = request.Username.Trim();
            var usernameExists = await context.Users
                .AnyAsync(x => x.Id != request.Id && x.Username.ToLower() == username.ToLower(), ct);

            if (usernameExists)
                throw new UniStayConflictException("Username is already in use.");

            user.Username = username;
        }

        if (!string.IsNullOrWhiteSpace(request.FirstName))
            user.Firstname = request.FirstName.Trim();

        if (!string.IsNullOrWhiteSpace(request.LastName))
            user.Lastname = request.LastName.Trim();

        if (request.Phone is not null)
            user.Phone = request.Phone.Trim();

        if (request.DateOfBirth.HasValue)
            user.DateOfBirth = request.DateOfBirth.Value;

        if (request.ProfileImage is not null)
            user.ProfileImage = request.ProfileImage.Trim();

        if (request.RoleId.HasValue)
            UserRoleMapper.ApplyRole(user, request.RoleId);

        if (request.IsEnabled.HasValue)
            user.IsEnabled = request.IsEnabled.Value;

        if (!string.IsNullOrWhiteSpace(request.Password))
        {
            user.PasswordHash = hasher.HashPassword(user, request.Password);
            user.TokenVersion++;
        }

        await context.SaveChangesAsync(ct);

        return Unit.Value;
    }
}
