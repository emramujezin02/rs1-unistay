namespace UniStay.Application.Modules.Housing.Reviews.Queries.ListByRoom;

public sealed class ListRoomReviewsQueryHandler(IAppDbContext context)
    : IRequestHandler<ListRoomReviewsQuery, IReadOnlyList<ListRoomReviewsQueryDto>>
{
    public async Task<IReadOnlyList<ListRoomReviewsQueryDto>> Handle(ListRoomReviewsQuery request, CancellationToken ct)
    {
        return await context.RoomReviews
            .AsNoTracking()
            .Where(x => x.RoomId == request.RoomId)
            .OrderByDescending(x => x.CreatedAtUtc)
            .Select(x => new ListRoomReviewsQueryDto
            {
                RoomReviewId = x.Id,
                Comment = x.Comment,
                Rating = x.Rating,
                CreatedAt = x.CreatedAtUtc,
                User = (x.User.Firstname + " " + x.User.Lastname).Trim(),
                Likes = x.Reactions.Count(r => r.IsLike),
                Dislikes = x.Reactions.Count(r => !r.IsLike)
            })
            .ToListAsync(ct);
    }
}
