namespace UniStay.Application.Modules.Account.Security.Queries.GetRecoveryQuestions;

public sealed class GetRecoverySecurityQuestionsQueryHandler(
    IAppDbContext context,
    ISecurityTokenService tokenService,
    TimeProvider timeProvider)
    : IRequestHandler<GetRecoverySecurityQuestionsQuery, IReadOnlyList<GetRecoverySecurityQuestionsQueryDto>>
{
    public async Task<IReadOnlyList<GetRecoverySecurityQuestionsQueryDto>> Handle(
        GetRecoverySecurityQuestionsQuery request,
        CancellationToken ct)
    {
        var now = timeProvider.GetUtcNow().UtcDateTime;
        var contextHash = tokenService.Hash(request.RecoveryContextId);
        var recoveryContext = await context.PasswordRecoveryContexts
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.ContextHash == contextHash, ct);

        if (recoveryContext is null
            || recoveryContext.Consumed
            || recoveryContext.ExpiresAtUtc < now
            || recoveryContext.FailedAttempts >= recoveryContext.MaxAttempts)
        {
            throw RecoveryUnavailable();
        }

        var questions = await context.UserSecurityAnswers
            .AsNoTracking()
            .Where(x => x.UserId == recoveryContext.UserId)
            .Select(x => new GetRecoverySecurityQuestionsQueryDto
            {
                QuestionId = x.SecurityQuestionId,
                Question = x.SecurityQuestion.Text
            })
            .ToListAsync(ct);

        if (questions.Count == 0)
            throw RecoveryUnavailable();

        return questions;
    }

    private static UniStayBusinessRuleException RecoveryUnavailable() =>
        new("RECOVERY_QUESTIONS_UNAVAILABLE", "Unable to continue with security questions. Use email recovery.");
}
