namespace UniStay.Application.Modules.AccommodationApplications.Commands.ApproveApplication;

public sealed class ApproveApplicationCommandValidator : AbstractValidator<ApproveApplicationCommand>
{
    public ApproveApplicationCommandValidator()
    {
        RuleFor(x => x.ApplicationId)
            .GreaterThan(0).WithMessage("ApplicationId is required.");

        RuleFor(x => x.BedId)
            .GreaterThan(0).WithMessage("BedId is required.");
    }
}
