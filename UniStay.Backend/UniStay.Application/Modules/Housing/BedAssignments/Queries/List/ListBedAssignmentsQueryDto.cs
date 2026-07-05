namespace UniStay.Application.Modules.Housing.BedAssignments.Queries.List;

public sealed class ListBedAssignmentsQueryDto
{
    public int AssignmentID { get; set; }
    public int BedID { get; set; }
    public string BedNumber { get; set; } = string.Empty;
    public int RoomID { get; set; }
    public string RoomNumber { get; set; } = string.Empty;
    public int StudentID { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public string StudenLName { get; set; } = string.Empty;
    public string StudentIdentifier { get; set; } = string.Empty;
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
}


