using UniStay.Domain.Entities.Reservations;

namespace UniStay.Application.Modules.HallReservations.Commands.CreateReservation;

public sealed class CreateReservationCommandHandler(
    IAppDbContext context,
    IAppCurrentUser currentUser)
    : IRequestHandler<CreateReservationCommand, CreateReservationResult>
{
    public async Task<CreateReservationResult> Handle(CreateReservationCommand request, CancellationToken ct)
    {
        var studentId = currentUser.UserId
            ?? throw new UnauthorizedAccessException("You must be logged in.");

        var hall = await context.Halls.FirstOrDefaultAsync(x => x.Id == request.HallId, ct)
            ?? throw new UniStayNotFoundException($"Hall {request.HallId} not found.");

        if (!hall.IsAvailable)
            throw new InvalidOperationException($"Hall '{hall.Name}' is currently not available for booking.");

        var hasConflict = await context.HallReservations.AnyAsync(
            x => x.HallId == request.HallId
                && (x.Status == ReservationStatusType.Pending || x.Status == ReservationStatusType.Active)
                && x.FromDate < request.ToDate
                && x.ToDate > request.FromDate,
            ct);

        if (hasConflict)
            throw new InvalidOperationException($"Hall '{hall.Name}' is already reserved for the requested time slot.");

        var reservation = new HallReservationEntity
        {
            HallId = request.HallId,
            StudentId = studentId,
            FromDate = request.FromDate,
            ToDate = request.ToDate,
            Status = ReservationStatusType.Pending
        };

        context.HallReservations.Add(reservation);
        await context.SaveChangesAsync(ct);

        return new CreateReservationResult(
            reservation.Id,
            hall.Name,
            reservation.FromDate,
            reservation.ToDate,
            reservation.Status.ToString());
    }
}
