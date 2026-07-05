namespace UniStay.Application.Modules.HallReservations.Commands.UpdateReservationStatus;

public sealed class UpdateReservationStatusCommandValidator : AbstractValidator<UpdateReservationStatusCommand>
{
    public UpdateReservationStatusCommandValidator()
    {
        RuleFor(x => x.ReservationId)
            .GreaterThan(0).WithMessage("ReservationId is required.");

        RuleFor(x => x.Status)
            .NotEmpty().WithMessage("Status is required.")
            .Must(x => string.Equals(x, "Active", StringComparison.OrdinalIgnoreCase)
                || string.Equals(x, "Rejected", StringComparison.OrdinalIgnoreCase))
            .WithMessage("Status must be 'Active' or 'Rejected'.");
    }
}
