using UniStay.Application.Modules.Auth.Commands.Login;
using UniStay.Application.Modules.Account.Users.Common;

public sealed class LoginCommandHandler(
    IAppDbContext ctx,
    IJwtTokenService jwt,
    IPasswordHasher<UniStayUserEntity> hasher,
    ISecurityTokenService securityTokenService,
    IEmailService emailService,
    TimeProvider timeProvider)
    : IRequestHandler<LoginCommand, LoginCommandDto>
{
    public async Task<LoginCommandDto> Handle(LoginCommand request, CancellationToken ct)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        var user = await ctx.Users
            .FirstOrDefaultAsync(x => x.Email.ToLower() == email && x.IsEnabled && !x.IsDeleted, ct)
            ?? throw new UniStayNotFoundException("User not found or disabled.");

        var verify = hasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
        if (verify == PasswordVerificationResult.Failed)
            throw new UniStayConflictException("Invalid credentials.");

        var isDemoUser = email is
            "admin@unistay.ba" or
            "student@unistay.ba" or
            "employee@unistay.ba";

        var fingerprintHash = string.IsNullOrWhiteSpace(request.Fingerprint)
            ? null
            : securityTokenService.Hash(request.Fingerprint);

        var isTrustedDevice = request.RememberMe &&
            fingerprintHash is not null &&
            await ctx.TrustedDevices.AsNoTracking().AnyAsync(x =>
                x.UserId == user.Id &&
                x.TokenHash == fingerprintHash &&
                x.ExpiresAtUtc > timeProvider.GetUtcNow().UtcDateTime, ct);

        if (!isDemoUser && !isTrustedDevice)
        {
            var code = securityTokenService.GenerateNumericCode(6);
            ctx.TwoFactorCodes.Add(new TwoFactorCodeEntity
            {
                UserId = user.Id,
                CodeHash = securityTokenService.Hash(code),
                ExpiresAtUtc = timeProvider.GetUtcNow().AddMinutes(10).UtcDateTime,
                Used = false
            });

            await ctx.SaveChangesAsync(ct);
            await emailService.SendEmailAsync(user.Email, "Your 2FA Code", $"Your verification code is: <b>{code}</b>.", ct);

            return new LoginCommandDto
            {
                RequiresTwoFactor = true,
                TwoFactorUserId = user.Id,
                UserId = user.Id,
                Email = user.Email,
                Theme = user.Theme,
                RoleName = UserRoleMapper.GetRoleName(user),
                AccessToken = string.Empty,
                RefreshToken = string.Empty
            };
        }

        var tokens = jwt.IssueTokens(user);

        ctx.RefreshTokens.Add(new RefreshTokenEntity
        {
            TokenHash = tokens.RefreshTokenHash,
            ExpiresAtUtc = tokens.RefreshTokenExpiresAtUtc,
            UserId = user.Id,
            Fingerprint = request.Fingerprint
        });

        await ctx.SaveChangesAsync(ct);

        return new LoginCommandDto
        {
            AccessToken = tokens.AccessToken,
            RefreshToken = tokens.RefreshTokenRaw,
            ExpiresAtUtc = tokens.RefreshTokenExpiresAtUtc,
            UserId = user.Id,
            Email = user.Email,
            Theme = user.Theme,
            RoleName = UserRoleMapper.GetRoleName(user)
        };
    }
}
