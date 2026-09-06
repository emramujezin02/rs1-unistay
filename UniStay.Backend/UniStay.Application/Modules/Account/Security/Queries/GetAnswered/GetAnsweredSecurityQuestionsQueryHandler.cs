namespace UniStay.Application.Modules.Account.Security.Queries.GetAnswered;

public sealed class GetAnsweredSecurityQuestionsQueryHandler(IAppDbContext context, IAppCurrentUser currentUser)
    : IRequestHandler<GetAnsweredSecurityQuestionsQuery, IReadOnlyList<GetAnsweredSecurityQuestionsQueryDto>>
{
    public async Task<IReadOnlyList<GetAnsweredSecurityQuestionsQueryDto>> Handle(GetAnsweredSecurityQuestionsQuery request, CancellationToken ct)
    {
        var currentUserId = currentUser.UserId
            ?? throw new UnauthorizedAccessException("User must be authenticated.");

        var user = await context.Users.FirstOrDefaultAsync(x => x.Id == currentUserId, ct)
            ?? throw new UniStayNotFoundException("User not found.");

        return await context.UserSecurityAnswers
            .AsNoTracking()
            .Where(x => x.UserId == user.Id)
            .Select(x => new GetAnsweredSecurityQuestionsQueryDto { QuestionId = x.SecurityQuestionId })
            .ToListAsync(ct);
    }
}
