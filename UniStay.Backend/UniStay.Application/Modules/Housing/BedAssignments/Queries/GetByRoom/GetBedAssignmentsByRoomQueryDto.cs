namespace UniStay.Application.Modules.Housing.BedAssignments.Queries.GetByRoom;

public sealed class GetBedAssignmentsByRoomQueryDto
{
    public int AssignmentID { get; set; }
    public int BedID { get; set; }
    public string BedNumber { get; set; } = string.Empty;
    public int StudentID { get; set; }
    public string Name { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
}
