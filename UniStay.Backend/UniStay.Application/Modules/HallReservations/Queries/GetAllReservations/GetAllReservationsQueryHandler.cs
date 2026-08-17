using UniStay.Domain.Entities.Reservations;

namespace UniStay.Application.Modules.HallReservations.Queries.GetAllReservations;

public sealed class GetAllReservationsQueryHandler(
    IAppDbContext context,
    IAppCurrentUser currentUser)
    : IRequestHandler<GetAllReservationsQuery, GetAllReservationsResult>
{
    public async Task<GetAllReservationsResult> Handle(GetAllReservationsQuery request, CancellationToken ct)
    {
        if (!currentUser.IsAdmin && !currentUser.IsEmployee)
            throw new UnauthorizedAccessException("Only admins and employees can view all hall reservations.");

        var query = context.HallReservations
            .AsNoTracking()
            .Include(x => x.Hall)
            .Include(x => x.Student)
            .AsQueryable();

        if (request.HallId.HasValue)
            query = query.Where(x => x.HallId == request.HallId.Value);

        if (!string.IsNullOrWhiteSpace(request.Status)
            && Enum.TryParse<ReservationStatusType>(request.Status, ignoreCase: true, out var parsedStatus))
        {
            query = query.Where(x => x.Status == parsedStatus);
        }

        var totalCount = await query.CountAsync(ct);

        var items = await query
            .OrderByDescending(x => x.FromDate)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(x => new AdminReservationListItemResult(
                x.Id,
                x.HallId,
                x.Hall != null ? x.Hall.Name : string.Empty,
                x.Hall != null ? x.Hall.Capacity : 0,
                x.StudentId,
                x.Student != null ? x.Student.Username : string.Empty,
                x.Student != null ? x.Student.Email : string.Empty,
                x.FromDate,
                x.ToDate,
                x.Status.ToString(),
                x.CreatedAtUtc))
            .ToListAsync(ct);

        return new GetAllReservationsResult(items, totalCount, request.PageNumber, request.PageSize);
    }
}
