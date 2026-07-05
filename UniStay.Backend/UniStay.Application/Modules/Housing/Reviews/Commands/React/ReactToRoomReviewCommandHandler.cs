namespace UniStay.Application.Modules.Housing.Reviews.Commands.React;

public sealed class ReactToRoomReviewCommandHandler(IAppDbContext context, IAppCurrentUser currentUser)
    : IRequestHandler<ReactToRoomReviewCommand>
{
    public async Task Handle(ReactToRoomReviewCommand request, CancellationToken ct)
    {
        var userId = currentUser.UserId
            ?? throw new UniStayBusinessRuleException("auth.required", "User must be authenticated.");

        var reviewExists = await context.RoomReviews.AnyAsync(x => x.Id == request.ReviewId, ct);
        if (!reviewExists)
            throw new UniStayNotFoundException("Review not found.");

        var existing = await context.ReviewReactions
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(x => x.RoomReviewId == request.ReviewId && x.UserId == userId, ct);

        if (existing is null)
        {
            context.ReviewReactions.Add(new ReviewReactionEntity
            {
                RoomReviewId = request.ReviewId,
                UserId = userId,
                IsLike = request.IsLike
            });
        }
        else if (existing.IsDeleted)
        {
            existing.IsDeleted = false;
            existing.IsLike = request.IsLike;
        }
        else if (existing.IsLike == request.IsLike)
        {
            context.ReviewReactions.Remove(existing);
        }
        else
        {
            existing.IsLike = request.IsLike;
        }

        await context.SaveChangesAsync(ct);
    }
}
