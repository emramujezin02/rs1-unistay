namespace UniStay.Application.Modules.AccommodationApplications.Commands.RejectApplication;

public sealed class RejectApplicationCommandValidator : AbstractValidator<RejectApplicationCommand>
{
    public RejectApplicationCommandValidator()
    {
        RuleFor(x => x.ApplicationId)
            .GreaterThan(0).WithMessage("ApplicationId is required.");
    }
}
