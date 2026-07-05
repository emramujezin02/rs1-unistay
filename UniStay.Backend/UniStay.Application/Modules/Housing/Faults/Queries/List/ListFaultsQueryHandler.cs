namespace UniStay.Application.Modules.Housing.Faults.Queries.List;

public sealed class ListFaultsQueryHandler(IAppDbContext context)
    : IRequestHandler<ListFaultsQuery, PageResult<ListFaultsQueryDto>>
{
    public async Task<PageResult<ListFaultsQueryDto>> Handle(ListFaultsQuery request, CancellationToken ct)
    {
        var query = context.Faults.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(request.Title))
            query = query.Where(x => x.Title.Contains(request.Title));

        if (request.ReportedByUserId.HasValue)
            query = query.Where(x => x.ReportedByUserId == request.ReportedByUserId.Value);

        if (request.IsResolved.HasValue)
            query = query.Where(x => x.IsResolved == request.IsResolved.Value);

        if (request.From.HasValue)
            query = query.Where(x => x.ReportedAtUtc >= request.From.Value);

        if (request.To.HasValue)
            query = query.Where(x => x.ReportedAtUtc <= request.To.Value);

        if (request.RoomId.HasValue)
            query = query.Where(x => x.RoomId == request.RoomId.Value);

        var projectedQuery = query
            .OrderByDescending(x => x.ReportedAtUtc)
            .Select(x => new ListFaultsQueryDto
            {
                Id = x.Id,
                Title = x.Title,
                Description = x.Description,
                Status = x.Status,
                IsResolved = x.IsResolved,
                ReportedAtUtc = x.ReportedAtUtc,
                ResolvedAtUtc = x.ResolvedAtUtc,
                Priority = x.Priority,
                ReportedByUserId = x.ReportedByUserId,
                ReportedByUserName = x.ReportedByUser == null
                    ? null
                    : (x.ReportedByUser.Firstname + " " + x.ReportedByUser.Lastname).Trim(),
                RoomId = x.RoomId
            });

        return await PageResult<ListFaultsQueryDto>.FromQueryableAsync(projectedQuery, request.Paging, ct);
    }
}
