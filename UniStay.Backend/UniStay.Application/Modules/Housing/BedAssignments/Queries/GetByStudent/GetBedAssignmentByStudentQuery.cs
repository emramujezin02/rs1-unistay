namespace UniStay.Application.Modules.Housing.BedAssignments.Queries.GetByStudent;

public sealed class GetBedAssignmentByStudentQuery : IRequest<GetBedAssignmentByStudentQueryDto>
{
    public int StudentId { get; set; }
}
