namespace UniStay.Application.Modules.Housing.Beds.Queries.ListFree;

public sealed class ListFreeBedsQueryHandler(IAppDbContext context)
    : IRequestHandler<ListFreeBedsQuery, PageResult<ListFreeBedsQueryDto>>
{
    public async Task<PageResult<ListFreeBedsQueryDto>> Handle(ListFreeBedsQuery request, CancellationToken ct)
    {
        var query = context.Beds
            .AsNoTracking()
            .Include(x => x.Room)
            .Include(x => x.Assignments)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Q))
        {
            var q = request.Q.Trim();
            query = query.Where(x =>
                x.BedNumber.Contains(q) ||
                x.Room.RoomNumber.Contains(q));
        }

        if (request.RoomId.HasValue)
            query = query.Where(x => x.RoomId == request.RoomId.Value);

        if (request.FromDate.HasValue && request.ToDate.HasValue)
        {
            query = query.Where(x => !x.Assignments.Any(a =>
                a.ToDate > request.FromDate.Value &&
                a.FromDate < request.ToDate.Value));
        }
        else
        {
            query = query.Where(x => !x.Assignments.Any());
        }

        var projectedQuery = query
            .OrderBy(x => x.Room.RoomNumber)
            .ThenBy(x => x.BedNumber)
            .Select(x => new ListFreeBedsQueryDto
            {
                BedId = x.Id,
                BedNumber = x.BedNumber,
                RoomId = x.RoomId,
                RoomNumber = x.Room.RoomNumber,
                Floor = x.Room.Floor
            });

        return await PageResult<ListFreeBedsQueryDto>.FromQueryableAsync(projectedQuery, request.Paging, ct);
    }
}
