namespace UniStay.Application.Modules.Housing.BedAssignments.Queries.List;

public sealed class ListBedAssignmentsQuery : BasePagedQuery<ListBedAssignmentsQueryDto>
{
    public string? Q { get; init; }
    public int? BedId { get; init; }
    public int? RoomId { get; init; }
    public int? StudentId { get; init; }
}
