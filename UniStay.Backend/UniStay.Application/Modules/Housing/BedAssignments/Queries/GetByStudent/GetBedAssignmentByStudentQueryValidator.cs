namespace UniStay.Application.Modules.Housing.BedAssignments.Queries.GetByStudent;

public sealed class GetBedAssignmentByStudentQueryValidator : AbstractValidator<GetBedAssignmentByStudentQuery>
{
    public GetBedAssignmentByStudentQueryValidator()
    {
        RuleFor(x => x.StudentId).GreaterThan(0);
    }
}
