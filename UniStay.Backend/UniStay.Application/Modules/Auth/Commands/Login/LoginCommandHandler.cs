using UniStay.Application.Modules.Auth.Commands.Login;
using UniStay.Application.Modules.Account.Users.Common;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using UniStay.Shared.Options;

public sealed class LoginCommandHandler(
    IAppDbContext ctx,
    IJwtTokenService jwt,
    IPasswordHasher<UniStayUserEntity> hasher,
    ISecurityTokenService securityTokenService,
    IEmailService emailService,
    TimeProvider timeProvider,
    IOptions<TwoFactorOptions> twoFactorOptions,
    IHostEnvironment hostEnvironment)
    : IRequestHandler<LoginCommand, LoginCommandDto>
{
    public async Task<LoginCommandDto> Handle(LoginCommand request, CancellationToken ct)
    {
        var options = twoFactorOptions.Value;
        var email = request.Email.Trim().ToLowerInvariant();

        var user = await ctx.Users
            .FirstOrDefaultAsync(x => x.Email.ToLower() == email && x.IsEnabled && !x.IsDeleted, ct)
            ?? throw new UniStayNotFoundException("User not found or disabled.");

        var verify = hasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
        if (verify == PasswordVerificationResult.Failed)
            throw new UniStayConflictException("Invalid credentials.");

        var isDevelopmentDemoBypass = hostEnvironment.IsDevelopment() &&
            options.DevelopmentDemoBypassEmails.Any(x => string.Equals(x.Trim(), email, StringComparison.OrdinalIgnoreCase));

        var fingerprintHash = string.IsNullOrWhiteSpace(request.Fingerprint)
            ? null
            : securityTokenService.Hash(request.Fingerprint);

        var isTrustedDevice = request.RememberMe &&
            fingerprintHash is not null &&
            await ctx.TrustedDevices.AsNoTracking().AnyAsync(x =>
                x.UserId == user.Id &&
                x.TokenHash == fingerprintHash &&
                x.ExpiresAtUtc > timeProvider.GetUtcNow().UtcDateTime, ct);

        var twoFactorEnabled = await ctx.TwoFactorSettings.AsNoTracking().AnyAsync(x =>
            x.UserId == user.Id &&
            x.IsEnabled &&
            x.RequiresTwoFactor, ct);

        if (twoFactorEnabled && !isDevelopmentDemoBypass && !isTrustedDevice)
        {
            var code = securityTokenService.GenerateNumericCode(6);
            var challenge = securityTokenService.GenerateSecureToken(32);
            var now = timeProvider.GetUtcNow().UtcDateTime;

            ctx.TwoFactorCodes.Add(new TwoFactorCodeEntity
            {
                UserId = user.Id,
                CodeHash = securityTokenService.Hash(code),
                ExpiresAtUtc = now.AddMinutes(options.ChallengeMinutes),
                Used = false
            });
            ctx.TwoFactorLoginChallenges.Add(new TwoFactorLoginChallengeEntity
            {
                UserId = user.Id,
                ChallengeHash = securityTokenService.Hash(challenge),
                ExpiresAtUtc = now.AddMinutes(options.ChallengeMinutes),
                FailedAttempts = 0,
                MaxAttempts = options.MaxVerifyAttempts,
                Consumed = false,
                CreatedAtUtc = now
            });

            await ctx.SaveChangesAsync(ct);
            await emailService.SendEmailAsync(user.Email, "Your 2FA Code", $"Your verification code is: <b>{code}</b>.", ct);

            return new LoginCommandDto
            {
                RequiresTwoFactor = true,
                TwoFactorChallengeId = challenge,
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
