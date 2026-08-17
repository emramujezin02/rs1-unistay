namespace UniStay.Application.Modules.Housing.BedAssignments.Queries.List;

public sealed class ListBedAssignmentsQueryValidator : AbstractValidator<ListBedAssignmentsQuery>
{
    public ListBedAssignmentsQueryValidator()
    {
        RuleFor(x => x.BedId).GreaterThan(0).When(x => x.BedId.HasValue);
        RuleFor(x => x.RoomId).GreaterThan(0).When(x => x.RoomId.HasValue);
        RuleFor(x => x.StudentId).GreaterThan(0).When(x => x.StudentId.HasValue);
    }
}
