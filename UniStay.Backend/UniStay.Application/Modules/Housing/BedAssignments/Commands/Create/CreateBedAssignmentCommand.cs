namespace UniStay.Application.Modules.Housing.BedAssignments.Commands.Create;

public sealed class CreateBedAssignmentCommand : IRequest<int>
{
    public int BedID { get; set; }
    public int StudentID { get; set; }
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
}
