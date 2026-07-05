namespace UniStay.Application.Modules.Housing.BedAssignments.Queries.GetByRoom;

public sealed class GetBedAssignmentsByRoomQuery : IRequest<IReadOnlyList<GetBedAssignmentsByRoomQueryDto>>
{
    public int RoomId { get; set; }
}
