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
        var email = request.Email.Trim().ToLowerInvariant();
        var user = await context.Users.FirstOrDefaultAsync(x => x.Email.ToLower() == email, ct)
            ?? throw new UniStayNotFoundException("User not found.");

        var stored = await context.UserSecurityAnswers.Where(x => x.UserId == user.Id).ToListAsync(ct);
        if (stored.Count == 0)
            throw new UniStayBusinessRuleException("NO_SECURITY_QUESTIONS", "No security questions set.");

        if (request.Answers.Count != stored.Count)
            throw new UniStayBusinessRuleException("ANSWERS_COUNT_MISMATCH", "Answers count mismatch.");

        foreach (var provided in request.Answers)
        {
            var saved = stored.FirstOrDefault(x => x.SecurityQuestionId == provided.QuestionId)
                ?? throw new UniStayBusinessRuleException("INVALID_QUESTION", "Invalid question id.");

            var result = hasher.VerifyHashedPassword(user, saved.AnswerHash, provided.Answer.Trim().ToLowerInvariant());
            if (result == PasswordVerificationResult.Failed)
                throw new UniStayConflictException("Answers do not match.");
        }

        var rawToken = tokenService.GenerateSecureToken(32);
        context.PasswordResetTokens.Add(new PasswordResetTokenEntity
        {
            UserId = user.Id,
            TokenHash = tokenService.Hash(rawToken),
            ExpiresAtUtc = timeProvider.GetUtcNow().AddHours(1).UtcDateTime,
            Used = false
        });

        await context.SaveChangesAsync(ct);
        await emailService.SendPasswordResetTokenAsync(user.Email, rawToken, ct);

        return new VerifySecurityAnswersCommandDto { Success = true, ResetToken = rawToken };
    }
}
