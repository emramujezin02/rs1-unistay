namespace UniStay.Application.Modules.Account.Security.Queries.GetQuestionsForUser;

public sealed class GetSecurityQuestionsForUserQueryHandler(IAppDbContext context, IAppCurrentUser currentUser)
    : IRequestHandler<GetSecurityQuestionsForUserQuery, IReadOnlyList<GetSecurityQuestionsForUserQueryDto>>
{
    public async Task<IReadOnlyList<GetSecurityQuestionsForUserQueryDto>> Handle(GetSecurityQuestionsForUserQuery request, CancellationToken ct)
    {
        var currentUserId = currentUser.UserId
            ?? throw new UnauthorizedAccessException("User must be authenticated.");

        var user = await context.Users.FirstOrDefaultAsync(x => x.Id == currentUserId, ct)
            ?? throw new UniStayNotFoundException("User not found.");

        var questions = await context.UserSecurityAnswers
            .AsNoTracking()
            .Where(x => x.UserId == user.Id)
            .Select(x => new GetSecurityQuestionsForUserQueryDto
            {
                QuestionId = x.SecurityQuestionId,
                Question = x.SecurityQuestion.Text
            })
            .ToListAsync(ct);

        if (questions.Count == 0)
            throw new UniStayBusinessRuleException("NO_SECURITY_QUESTIONS", "No security questions set for this account.");

        return questions;
    }
}
