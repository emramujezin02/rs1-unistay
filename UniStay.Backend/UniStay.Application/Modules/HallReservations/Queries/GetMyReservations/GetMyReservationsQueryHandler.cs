namespace UniStay.Application.Modules.HallReservations.Queries.GetMyReservations;

public sealed class GetMyReservationsQueryHandler(
    IAppDbContext context,
    IAppCurrentUser currentUser)
    : IRequestHandler<GetMyReservationsQuery, GetMyReservationsResult>
{
    public async Task<GetMyReservationsResult> Handle(GetMyReservationsQuery request, CancellationToken ct)
    {
        var studentId = currentUser.UserId
            ?? throw new UnauthorizedAccessException("You must be logged in.");

        var items = await context.HallReservations
            .AsNoTracking()
            .Include(x => x.Hall)
            .Where(x => x.StudentId == studentId)
            .OrderByDescending(x => x.FromDate)
            .Select(x => new ReservationListItemResult(
                x.Id,
                x.HallId,
                x.Hall != null ? x.Hall.Name : string.Empty,
                x.Hall != null ? x.Hall.Capacity : 0,
                x.FromDate,
                x.ToDate,
                x.Status.ToString(),
                x.CreatedAtUtc))
            .ToListAsync(ct);

        return new GetMyReservationsResult(items);
    }
}
