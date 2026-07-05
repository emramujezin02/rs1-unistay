namespace UniStay.Application.Modules.Account.Security.Commands.SetAnswers;

public sealed class SetSecurityAnswersCommandHandler(IAppDbContext context, IPasswordHasher<UniStayUserEntity> hasher)
    : IRequestHandler<SetSecurityAnswersCommand, Unit>
{
    public async Task<Unit> Handle(SetSecurityAnswersCommand request, CancellationToken ct)
    {
        var user = await context.Users.FirstOrDefaultAsync(x => x.Id == request.UserId, ct)
            ?? throw new UniStayNotFoundException("User not found.");

        foreach (var answer in request.Answers)
        {
            var questionExists = await context.SecurityQuestions.AnyAsync(x => x.Id == answer.QuestionId, ct);
            if (!questionExists)
                throw new UniStayNotFoundException($"Security question with Id {answer.QuestionId} not found.");

            var existing = await context.UserSecurityAnswers
                .FirstOrDefaultAsync(x => x.UserId == user.Id && x.SecurityQuestionId == answer.QuestionId, ct);

            var hash = hasher.HashPassword(user, answer.Answer.Trim().ToLowerInvariant());

            if (existing is null)
                context.UserSecurityAnswers.Add(new UserSecurityAnswerEntity { UserId = user.Id, SecurityQuestionId = answer.QuestionId, AnswerHash = hash });
            else
                existing.AnswerHash = hash;
        }

        await context.SaveChangesAsync(ct);
        return Unit.Value;
    }
}
