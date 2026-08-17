namespace UniStay.Application.Modules.HallReservations.Commands.CreateReservation;

public sealed class CreateReservationCommandValidator : AbstractValidator<CreateReservationCommand>
{
    public CreateReservationCommandValidator()
    {
        RuleFor(x => x.HallId)
            .GreaterThan(0).WithMessage("HallId is required.");

        RuleFor(x => x.FromDate)
            .NotEmpty().WithMessage("FromDate is required.")
            .GreaterThan(DateTime.UtcNow).WithMessage("FromDate must be in the future.");

        RuleFor(x => x.ToDate)
            .NotEmpty().WithMessage("ToDate is required.")
            .GreaterThan(x => x.FromDate).WithMessage("ToDate must be after FromDate.");
    }
}
