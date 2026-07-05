using UniStay.Application.Modules.Auth.Commands.Login;
using UniStay.Application.Modules.Account.Users.Common;

namespace UniStay.Application.Modules.Account.TwoFactor.Commands.Verify;

public sealed class VerifyTwoFactorCommandHandler(
    IAppDbContext context,
    ISecurityTokenService tokenService,
    IJwtTokenService jwt,
    TimeProvider timeProvider)
    : IRequestHandler<VerifyTwoFactorCommand, LoginCommandDto>
{
    public async Task<LoginCommandDto> Handle(VerifyTwoFactorCommand request, CancellationToken ct)
    {
        var user = await context.Users.FirstOrDefaultAsync(x => x.Id == request.UserId && x.IsEnabled, ct)
            ?? throw new UniStayNotFoundException("User not found.");

        var codeHash = tokenService.Hash(request.Code);
        var now = timeProvider.GetUtcNow().UtcDateTime;

        var code = await context.TwoFactorCodes
            .Where(x => x.UserId == user.Id && !x.Used && x.ExpiresAtUtc >= now)
            .OrderByDescending(x => x.CreatedAtUtc)
            .FirstOrDefaultAsync(x => x.CodeHash == codeHash, ct);

        var backup = code is null
            ? await context.BackupCodes.FirstOrDefaultAsync(x => x.UserId == user.Id && !x.Used && x.CodeHash == codeHash, ct)
            : null;

        if (code is null && backup is null)
            throw new UniStayConflictException("Invalid or expired code.");

        if (code is not null)
            code.Used = true;
        if (backup is not null)
            backup.Used = true;

        if (request.RememberMe)
        {
            var trustedRaw = request.Fingerprint ?? tokenService.GenerateSecureToken(32);
            context.TrustedDevices.Add(new TrustedDeviceEntity
            {
                UserId = user.Id,
                TokenHash = tokenService.Hash(trustedRaw),
                ExpiresAtUtc = timeProvider.GetUtcNow().AddDays(30).UtcDateTime
            });
        }

        var tokens = jwt.IssueTokens(user);
        context.RefreshTokens.Add(new RefreshTokenEntity
        {
            TokenHash = tokens.RefreshTokenHash,
            ExpiresAtUtc = tokens.RefreshTokenExpiresAtUtc,
            UserId = user.Id,
            Fingerprint = request.Fingerprint
        });

        await context.SaveChangesAsync(ct);

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
