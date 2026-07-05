namespace UniStay.Application.Modules.Housing.Equipment.Queries.List;

public sealed class ListEquipmentQueryHandler(IAppDbContext context)
    : IRequestHandler<ListEquipmentQuery, PageResult<ListEquipmentQueryDto>>
{
    public async Task<PageResult<ListEquipmentQueryDto>> Handle(ListEquipmentQuery request, CancellationToken ct)
    {
        var query = context.Equipment.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(request.Name))
            query = query.Where(x => x.Name.Contains(request.Name));

        if (!string.IsNullOrWhiteSpace(request.Type))
            query = query.Where(x => x.EquipmentType == request.Type);

        if (request.MinQuantity.HasValue)
            query = query.Where(x => x.Items.Count >= request.MinQuantity.Value);

        if (request.MaxQuantity.HasValue)
            query = query.Where(x => x.Items.Count <= request.MaxQuantity.Value);

        if (request.AvailableOnly == true)
            query = query.Where(x => x.Items.Any(i => i.IsAvailable));

        var projectedQuery = query
            .OrderBy(x => x.Name)
            .Select(x => new ListEquipmentQueryDto
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
                Quantity = x.Items.Count,
                AvailableQuantity = x.Items.Count(i => i.IsAvailable),
                RentalPrice = x.RentalPrice,
                EquipmentType = x.EquipmentType
            });

        return await PageResult<ListEquipmentQueryDto>.FromQueryableAsync(projectedQuery, request.Paging, ct);
    }
}
