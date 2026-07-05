namespace UniStay.Application.Modules.Housing.BedAssignments.Queries.GetByStudent;

public sealed class GetBedAssignmentByStudentQueryDto
{
    public int AssignmentID { get; set; }
    public int BedID { get; set; }
    public string BedNumber { get; set; } = string.Empty;
    public int RoomID { get; set; }
    public string RoomNumber { get; set; } = string.Empty;
    public int Floor { get; set; }
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
}
