namespace UniStay.Application.Modules.HallReservations.Commands.CancelReservation;

public sealed class CancelReservationCommandValidator : AbstractValidator<CancelReservationCommand>
{
    public CancelReservationCommandValidator()
    {
        RuleFor(x => x.ReservationId)
            .GreaterThan(0).WithMessage("ReservationId is required.");
    }
}
