using UniStay.Domain.Entities.Reservations;

namespace UniStay.Application.Modules.HallReservations.Commands.CancelReservation;

public sealed class CancelReservationCommandHandler(
    IAppDbContext context,
    IAppCurrentUser currentUser)
    : IRequestHandler<CancelReservationCommand, CancelReservationResult>
{
    public async Task<CancelReservationResult> Handle(CancelReservationCommand request, CancellationToken ct)
    {
        var callerId = currentUser.UserId
            ?? throw new UnauthorizedAccessException("You must be logged in.");

        var reservation = await context.HallReservations
            .FirstOrDefaultAsync(x => x.Id == request.ReservationId, ct)
            ?? throw new UniStayNotFoundException($"Reservation {request.ReservationId} not found.");

        if (!currentUser.IsAdmin && !currentUser.IsEmployee && reservation.StudentId != callerId)
            throw new UnauthorizedAccessException("You are not authorised to cancel this reservation.");

        if (reservation.Status == ReservationStatusType.Cancelled)
            throw new InvalidOperationException("This reservation has already been cancelled.");

        if (reservation.Status == ReservationStatusType.Rejected)
            throw new InvalidOperationException("A rejected reservation cannot be cancelled.");

        if (reservation.Status == ReservationStatusType.Active && reservation.FromDate <= DateTime.UtcNow)
            throw new InvalidOperationException("Cannot cancel a reservation that has already started or passed.");

        reservation.Status = ReservationStatusType.Cancelled;
        await context.SaveChangesAsync(ct);

        return new CancelReservationResult(reservation.Id);
    }
}
