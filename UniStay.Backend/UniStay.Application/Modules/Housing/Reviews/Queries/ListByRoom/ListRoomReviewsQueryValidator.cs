namespace UniStay.Application.Modules.Housing.Reviews.Queries.ListByRoom;

public sealed class ListRoomReviewsQueryValidator : AbstractValidator<ListRoomReviewsQuery>
{
    public ListRoomReviewsQueryValidator()
    {
        RuleFor(x => x.RoomId).GreaterThan(0);
    }
}
