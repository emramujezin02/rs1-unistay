namespace UniStay.Application.Modules.Housing.BedAssignments.Commands.Delete;

public sealed class DeleteBedAssignmentCommandValidator : AbstractValidator<DeleteBedAssignmentCommand>
{
    public DeleteBedAssignmentCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0);
    }
}
