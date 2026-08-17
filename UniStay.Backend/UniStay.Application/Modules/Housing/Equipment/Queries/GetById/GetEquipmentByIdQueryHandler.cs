namespace UniStay.Application.Modules.Housing.Equipment.Queries.GetById;

public sealed class GetEquipmentByIdQueryHandler(IAppDbContext context)
    : IRequestHandler<GetEquipmentByIdQuery, GetEquipmentByIdQueryDto>
{
    public async Task<GetEquipmentByIdQueryDto> Handle(GetEquipmentByIdQuery request, CancellationToken ct)
    {
        var equipment = await context.Equipment
            .AsNoTracking()
            .Where(x => x.Id == request.Id)
            .Select(x => new GetEquipmentByIdQueryDto
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
                Quantity = x.Items.Count,
                AvailableQuantity = x.Items.Count(i => i.IsAvailable),
                RentalPrice = x.RentalPrice,
                EquipmentType = x.EquipmentType
            })
            .FirstOrDefaultAsync(ct);

        if (equipment is null)
            throw new UniStayNotFoundException($"Equipment with Id {request.Id} not found.");

        return equipment;
    }
}
