namespace UniStay.Application.Modules.Housing.Equipment.Commands.Create;

public sealed class CreateEquipmentCommandHandler(IAppDbContext context, IAppCurrentUser currentUser)
    : IRequestHandler<CreateEquipmentCommand, int>
{
    public async Task<int> Handle(CreateEquipmentCommand request, CancellationToken ct)
    {
        if (!currentUser.IsAdmin && !currentUser.IsEmployee)
            throw new UnauthorizedAccessException("Only admins and employees can create equipment.");

        var name = request.Name.Trim();

        var exists = await context.Equipment
            .AnyAsync(x => x.Name.ToLower() == name.ToLower(), ct);

        if (exists)
            throw new UniStayConflictException("Equipment name already exists.");

        var equipment = new EquipmentEntity
        {
            Name = name,
            Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim(),
            RentalPrice = string.IsNullOrWhiteSpace(request.RentalPrice) ? null : request.RentalPrice.Trim(),
            EquipmentType = string.IsNullOrWhiteSpace(request.EquipmentType) ? null : request.EquipmentType.Trim()
        };

        for (var i = 1; i <= request.Quantity; i++)
        {
            equipment.Items.Add(new EquipmentItemEntity
            {
                SerialNumber = $"{name}-{i}",
                IsAvailable = i <= request.AvailableQuantity
            });
        }

        context.Equipment.Add(equipment);
        await context.SaveChangesAsync(ct);

        return equipment.Id;
    }
}
