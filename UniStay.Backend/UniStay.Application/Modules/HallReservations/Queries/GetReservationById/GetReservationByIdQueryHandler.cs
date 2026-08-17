namespace UniStay.Application.Modules.HallReservations.Queries.GetReservationById;

public sealed class GetReservationByIdQueryHandler(
    IAppDbContext context,
    IAppCurrentUser currentUser)
    : IRequestHandler<GetReservationByIdQuery, GetReservationByIdResult>
{
    public async Task<GetReservationByIdResult> Handle(GetReservationByIdQuery request, CancellationToken ct)
    {
        var callerId = currentUser.UserId
            ?? throw new UnauthorizedAccessException("You must be logged in.");

        var reservation = await context.HallReservations
            .AsNoTracking()
            .Include(x => x.Hall)
            .Include(x => x.Student)
            .FirstOrDefaultAsync(x => x.Id == request.ReservationId, ct)
            ?? throw new UniStayNotFoundException($"Reservation {request.ReservationId} not found.");

        if (!currentUser.IsAdmin && !currentUser.IsEmployee && reservation.StudentId != callerId)
            throw new UnauthorizedAccessException("You are not authorised to view this reservation.");

        return new GetReservationByIdResult(
            reservation.Id,
            reservation.HallId,
            reservation.Hall?.Name ?? string.Empty,
            reservation.Hall?.Capacity ?? 0,
            reservation.Hall?.Description,
            reservation.StudentId,
            reservation.Student?.Username ?? string.Empty,
            reservation.Student?.Email ?? string.Empty,
            reservation.Student?.Firstname ?? string.Empty,
            reservation.Student?.Lastname ?? string.Empty,
            reservation.FromDate,
            reservation.ToDate,
            reservation.Status.ToString(),
            reservation.CreatedAtUtc);
    }
}
