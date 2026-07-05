namespace UniStay.Application.Modules.Housing.Rooms.Common;

public sealed class RoomBedDto
{
    public int BedId { get; set; }
    public string BedNumber { get; set; } = string.Empty;
    public IReadOnlyList<RoomBedAssignmentDto> Assignments { get; set; } = Array.Empty<RoomBedAssignmentDto>();
}
