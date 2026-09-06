using UniStay.Application.Modules.Account.Users.Common;

namespace UniStay.Application.Modules.Account.Users.Commands.Register;

public sealed class RegisterUserCommandHandler(
    IAppDbContext context,
    IPasswordHasher<UniStayUserEntity> hasher,
    ISecurityTokenService tokenService,
    TimeProvider timeProvider)
    : IRequestHandler<RegisterUserCommand, RegisterUserResult>
{
    public async Task<RegisterUserResult> Handle(RegisterUserCommand request, CancellationToken ct)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var username = request.Username.Trim();
        var normalizedUsername = username.ToLowerInvariant();
        InviteTokenEntity? invite = null;

        if (!string.IsNullOrWhiteSpace(request.InviteToken))
        {
            var tokenHash = tokenService.Hash(request.InviteToken.Trim());
            var now = timeProvider.GetUtcNow().UtcDateTime;

            invite = await context.InviteTokens
                .FirstOrDefaultAsync(x => x.TokenHash == tokenHash && !x.Used, ct)
                ?? throw new UniStayNotFoundException("Invite token not found.");

            if (invite.ExpiresAtUtc <= now)
                throw new UniStayConflictException("Invite token has expired.");

            if (!string.Equals(invite.Email.Trim(), email, StringComparison.OrdinalIgnoreCase))
                throw new UniStayConflictException("Invite token does not match the registration email.");
        }

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

        context.TwoFactorSettings.Add(new TwoFactorSettingEntity
        {
            User = user,
            IsEnabled = true,
            RequiresTwoFactor = true,
            EnabledAtUtc = timeProvider.GetUtcNow().UtcDateTime,
            Method = "email"
        });

        if (invite is not null)
        {
            invite.Used = true;
        }

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

