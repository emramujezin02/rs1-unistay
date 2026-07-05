namespace UniStay.Application.Modules.Housing.Halls.Queries.List;

public sealed class ListHallsQueryHandler(IAppDbContext context)
    : IRequestHandler<ListHallsQuery, PageResult<ListHallsQueryDto>>
{
    public async Task<PageResult<ListHallsQueryDto>> Handle(ListHallsQuery request, CancellationToken ct)
    {
        var query = context.Halls.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(request.Name))
            query = query.Where(x => x.Name.Contains(request.Name));

        if (request.MinCapacity.HasValue)
            query = query.Where(x => x.Capacity >= request.MinCapacity.Value);

        if (request.MaxCapacity.HasValue)
            query = query.Where(x => x.Capacity <= request.MaxCapacity.Value);

        if (request.IsAvailable.HasValue)
            query = query.Where(x => x.IsAvailable == request.IsAvailable.Value);

        if (request.Date.HasValue)
            query = query.Where(x => x.AvailableFrom <= request.Date.Value && x.AvailableTo >= request.Date.Value);

        var projectedQuery = query
            .OrderBy(x => x.Name)
            .Select(x => new ListHallsQueryDto
            {
                Id = x.Id,
                Name = x.Name,
                Capacity = x.Capacity,
                Description = x.Description,
                AvailableFrom = x.AvailableFrom,
                AvailableTo = x.AvailableTo,
                IsAvailable = x.IsAvailable
            });

        return await PageResult<ListHallsQueryDto>.FromQueryableAsync(projectedQuery, request.Paging, ct);
    }
}
