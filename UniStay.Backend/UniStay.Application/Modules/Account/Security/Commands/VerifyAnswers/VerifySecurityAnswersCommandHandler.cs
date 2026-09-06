namespace UniStay.Application.Modules.Account.Security.Commands.VerifyAnswers;

public sealed class VerifySecurityAnswersCommandHandler(
    IAppDbContext context,
    IPasswordHasher<UniStayUserEntity> hasher,
    ISecurityTokenService tokenService,
    IEmailService emailService,
    TimeProvider timeProvider)
    : IRequestHandler<VerifySecurityAnswersCommand, VerifySecurityAnswersCommandDto>
{
    public async Task<VerifySecurityAnswersCommandDto> Handle(VerifySecurityAnswersCommand request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.RecoveryContextId))
            throw VerificationFailed();

        var now = timeProvider.GetUtcNow().UtcDateTime;
        var contextHash = tokenService.Hash(request.RecoveryContextId);
        var recoveryContext = await context.PasswordRecoveryContexts
            .Include(x => x.User)
            .FirstOrDefaultAsync(x => x.ContextHash == contextHash, ct);

        if (recoveryContext is null
            || recoveryContext.Consumed
            || recoveryContext.ExpiresAtUtc < now
            || recoveryContext.FailedAttempts >= recoveryContext.MaxAttempts)
        {
            throw VerificationFailed();
        }

        var user = recoveryContext.User;
        var answers = request.Answers ?? [];
        var stored = await context.UserSecurityAnswers.Where(x => x.UserId == user.Id).ToListAsync(ct);
        if (stored.Count == 0)
            await RegisterFailedAttemptAndThrow(recoveryContext, ct);

        if (answers.Count != stored.Count)
            await RegisterFailedAttemptAndThrow(recoveryContext, ct);

        foreach (var provided in answers)
        {
            if (string.IsNullOrWhiteSpace(provided.Answer))
                await RegisterFailedAttemptAndThrow(recoveryContext, ct);

            var saved = stored.FirstOrDefault(x => x.SecurityQuestionId == provided.QuestionId);
            if (saved is null)
                await RegisterFailedAttemptAndThrow(recoveryContext, ct);

            var result = hasher.VerifyHashedPassword(user, saved!.AnswerHash, provided.Answer.Trim().ToLowerInvariant());
            if (result == PasswordVerificationResult.Failed)
                await RegisterFailedAttemptAndThrow(recoveryContext, ct);
        }

        var rawToken = tokenService.GenerateSecureToken(32);
        context.PasswordResetTokens.Add(new PasswordResetTokenEntity
        {
            UserId = user.Id,
            TokenHash = tokenService.Hash(rawToken),
            ExpiresAtUtc = now.AddHours(1),
            Used = false
        });
        recoveryContext.Consumed = true;

        await context.SaveChangesAsync(ct);
        await emailService.SendPasswordResetTokenAsync(user.Email, rawToken, ct);

        return new VerifySecurityAnswersCommandDto { Success = true };
    }

    private async Task RegisterFailedAttemptAndThrow(PasswordRecoveryContextEntity recoveryContext, CancellationToken ct)
    {
        recoveryContext.FailedAttempts++;
        if (recoveryContext.FailedAttempts >= recoveryContext.MaxAttempts)
            recoveryContext.Consumed = true;

        await context.SaveChangesAsync(ct);
        throw VerificationFailed();
    }

    private static UniStayBusinessRuleException VerificationFailed() =>
        new("SECURITY_ANSWERS_VERIFICATION_FAILED", "Verification failed.");
}
