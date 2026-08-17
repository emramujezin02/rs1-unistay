namespace UniStay.Application.Modules.Housing.BedAssignments.Commands.Create;

public sealed class CreateBedAssignmentCommandValidator : AbstractValidator<CreateBedAssignmentCommand>
{
    public CreateBedAssignmentCommandValidator()
    {
        RuleFor(x => x.BedID).GreaterThan(0);
        RuleFor(x => x.StudentID).GreaterThan(0);
        RuleFor(x => x.FromDate).NotEmpty();
        RuleFor(x => x.ToDate)
            .NotEmpty()
            .GreaterThan(x => x.FromDate)
            .WithMessage("FromDate must be before ToDate.");
    }
}
