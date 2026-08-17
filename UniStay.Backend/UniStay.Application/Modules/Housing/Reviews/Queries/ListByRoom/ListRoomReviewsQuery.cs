namespace UniStay.Application.Modules.Housing.Reviews.Queries.ListByRoom;

public sealed class ListRoomReviewsQuery : IRequest<IReadOnlyList<ListRoomReviewsQueryDto>>
{
    public int RoomId { get; set; }
}
