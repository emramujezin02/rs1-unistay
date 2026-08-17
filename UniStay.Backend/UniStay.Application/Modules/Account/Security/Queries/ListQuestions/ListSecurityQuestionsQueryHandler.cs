namespace UniStay.Application.Modules.Account.Security.Queries.ListQuestions;

public sealed class ListSecurityQuestionsQueryHandler(IAppDbContext context)
    : IRequestHandler<ListSecurityQuestionsQuery, IReadOnlyList<ListSecurityQuestionsQueryDto>>
{
    public async Task<IReadOnlyList<ListSecurityQuestionsQueryDto>> Handle(ListSecurityQuestionsQuery request, CancellationToken ct)
    {
        return await context.SecurityQuestions
            .AsNoTracking()
            .OrderBy(x => x.Id)
            .Select(x => new ListSecurityQuestionsQueryDto { QuestionId = x.Id, Question = x.Text })
            .ToListAsync(ct);
    }
}
