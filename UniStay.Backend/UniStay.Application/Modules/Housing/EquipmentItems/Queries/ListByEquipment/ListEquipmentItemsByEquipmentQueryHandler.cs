namespace UniStay.Application.Modules.Housing.EquipmentItems.Queries.ListByEquipment;

public sealed class ListEquipmentItemsByEquipmentQueryHandler(IAppDbContext context)
    : IRequestHandler<ListEquipmentItemsByEquipmentQuery, IReadOnlyList<ListEquipmentItemsByEquipmentQueryDto>>
{
    public async Task<IReadOnlyList<ListEquipmentItemsByEquipmentQueryDto>> Handle(ListEquipmentItemsByEquipmentQuery request, CancellationToken ct)
    {
        var equipmentExists = await context.Equipment.AnyAsync(x => x.Id == request.EquipmentId, ct);

        if (!equipmentExists)
            throw new UniStayNotFoundException($"Equipment with Id {request.EquipmentId} not found.");

        return await context.EquipmentItems
            .AsNoTracking()
            .Where(x => x.EquipmentId == request.EquipmentId)
            .OrderByDescending(x => x.IsAvailable)
            .ThenBy(x => x.SerialNumber)
            .Select(x => new ListEquipmentItemsByEquipmentQueryDto
            {
                Id = x.Id,
                SerialNumber = x.SerialNumber,
                IsAvailable = x.IsAvailable,
                Location = x.Location,
                AssignedAtUtc = x.AssignedAtUtc,
                ReturnedAtUtc = x.ReturnedAtUtc
            })
            .ToListAsync(ct);
    }
}
