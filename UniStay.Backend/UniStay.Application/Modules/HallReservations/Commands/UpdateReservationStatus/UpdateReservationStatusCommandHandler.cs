using UniStay.Domain.Entities.Reservations;

namespace UniStay.Application.Modules.HallReservations.Commands.UpdateReservationStatus;

public sealed class UpdateReservationStatusCommandHandler(
    IAppDbContext context,
    IAppCurrentUser currentUser)
    : IRequestHandler<UpdateReservationStatusCommand, UpdateReservationStatusResult>
{
    public async Task<UpdateReservationStatusResult> Handle(UpdateReservationStatusCommand request, CancellationToken ct)
    {
        if (!currentUser.IsAdmin && !currentUser.IsEmployee)
            throw new UnauthorizedAccessException("Only admins and employees may approve or reject reservations.");

        var reservation = await context.HallReservations
            .Include(x => x.Hall)
            .FirstOrDefaultAsync(x => x.Id == request.ReservationId, ct)
            ?? throw new UniStayNotFoundException($"Reservation {request.ReservationId} not found.");

        if (reservation.Status != ReservationStatusType.Pending)
            throw new InvalidOperationException("Only pending reservations can be approved or rejected.");

        var newStatus = Enum.Parse<ReservationStatusType>(request.Status, ignoreCase: true);

        if (newStatus == ReservationStatusType.Active)
        {
            var hasConflict = await context.HallReservations.AnyAsync(
                x => x.Id != reservation.Id
                    && x.HallId == reservation.HallId
                    && x.Status == ReservationStatusType.Active
                    && x.FromDate < reservation.ToDate
                    && x.ToDate > reservation.FromDate,
                ct);

            if (hasConflict)
                throw new InvalidOperationException("Hall is already booked for this reservation time slot.");
        }

        reservation.Status = newStatus;
        await context.SaveChangesAsync(ct);

        return new UpdateReservationStatusResult(
            reservation.Id,
            reservation.Hall?.Name ?? string.Empty,
            reservation.Status.ToString());
    }
}
