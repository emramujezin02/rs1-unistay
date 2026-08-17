namespace UniStay.Application.Modules.Housing.Reviews.Commands.Create;

public sealed class CreateRoomReviewCommandHandler(IAppDbContext context, IAppCurrentUser currentUser)
    : IRequestHandler<CreateRoomReviewCommand, int>
{
    public async Task<int> Handle(CreateRoomReviewCommand request, CancellationToken ct)
    {
        var userId = currentUser.UserId
            ?? throw new UniStayBusinessRuleException("auth.required", "User must be authenticated.");

        var roomExists = await context.Rooms.AnyAsync(x => x.Id == request.RoomId, ct);
        if (!roomExists)
            throw new UniStayNotFoundException("Room not found.");

        var review = new RoomReviewEntity
        {
            RoomId = request.RoomId,
            UserId = userId,
            Rating = request.Rating,
            Comment = request.Comment.Trim()
        };

        context.RoomReviews.Add(review);
        await context.SaveChangesAsync(ct);

        return review.Id;
    }
}
