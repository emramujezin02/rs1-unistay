namespace UniStay.Application.Modules.Account.Profile.Commands.ChangeCurrentPassword;

public sealed class ChangeCurrentPasswordCommandHandler(
    IAppDbContext context,
    IAppCurrentUser currentUser,
    IPasswordHasher<UniStayUserEntity> hasher)
    : IRequestHandler<ChangeCurrentPasswordCommand, ChangeCurrentPasswordResult>
{
    public async Task<ChangeCurrentPasswordResult> Handle(ChangeCurrentPasswordCommand request, CancellationToken ct)
    {
        var userId = currentUser.UserId
            ?? throw new UnauthorizedAccessException("User must be authenticated.");

        var user = await context.Users
            .FirstOrDefaultAsync(x => x.Id == userId && !x.IsDeleted, ct)
            ?? throw new UniStayNotFoundException("Current user was not found.");

        var verificationResult = hasher.VerifyHashedPassword(user, user.PasswordHash, request.CurrentPassword);
        if (verificationResult == PasswordVerificationResult.Failed)
            throw new UniStayConflictException("Current password is incorrect.");

        user.PasswordHash = hasher.HashPassword(user, request.NewPassword);
        user.TokenVersion++;

        await context.SaveChangesAsync(ct);

        return new ChangeCurrentPasswordResult("Password changed successfully.");
    }
}
