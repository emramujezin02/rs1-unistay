namespace UniStay.Application.Modules.Housing.EquipmentItems.Commands.Create;

public sealed class CreateEquipmentItemCommandHandler(IAppDbContext context)
    : IRequestHandler<CreateEquipmentItemCommand, int>
{
    public async Task<int> Handle(CreateEquipmentItemCommand request, CancellationToken ct)
    {
        var equipmentExists = await context.Equipment
            .AnyAsync(x => x.Id == request.EquipmentId, ct);

        if (!equipmentExists)
            throw new UniStayNotFoundException($"Equipment with Id {request.EquipmentId} not found.");

        var item = new EquipmentItemEntity
        {
            EquipmentId = request.EquipmentId,
            SerialNumber = string.IsNullOrWhiteSpace(request.SerialNumber) ? null : request.SerialNumber.Trim(),
            IsAvailable = request.IsAvailable,
            AssignedAtUtc = request.IsAvailable ? null : request.AssignedAtUtc,
            ReturnedAtUtc = request.IsAvailable ? null : request.ReturnedAtUtc,
            Location = request.IsAvailable || string.IsNullOrWhiteSpace(request.Location) ? null : request.Location.Trim()
        };

        context.EquipmentItems.Add(item);
        await context.SaveChangesAsync(ct);

        return item.Id;
    }
}
