namespace UniStay.Application.Modules.Housing.Rooms.Common;

public sealed class RoomBedAssignmentDto
{
    public int AssignmentId { get; set; }
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public int StudentId { get; set; }
    public string StudentFirstName { get; set; } = string.Empty;
    public string StudentLastName { get; set; } = string.Empty;
}
