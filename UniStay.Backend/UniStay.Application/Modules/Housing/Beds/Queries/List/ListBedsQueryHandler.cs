namespace UniStay.Application.Modules.Housing.Beds.Queries.List;

public sealed class ListBedsQueryHandler(IAppDbContext context)
    : IRequestHandler<ListBedsQuery, PageResult<ListBedsQueryDto>>
{
    public async Task<PageResult<ListBedsQueryDto>> Handle(ListBedsQuery request, CancellationToken ct)
    {
        var query = context.Beds
            .AsNoTracking()
            .Include(x => x.Room)
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

        var projectedQuery = query
            .OrderBy(x => x.Room.RoomNumber)
            .ThenBy(x => x.BedNumber)
            .Select(x => new ListBedsQueryDto
            {
                BedId = x.Id,
                BedNumber = x.BedNumber,
                RoomID = x.RoomId,
                RoomNumber = x.Room.RoomNumber
            });

        return await PageResult<ListBedsQueryDto>.FromQueryableAsync(projectedQuery, request.Paging, ct);
    }
}
