namespace UniStay.Application.Modules.Housing.Equipment.Commands.Update;

public sealed class UpdateEquipmentCommandHandler(IAppDbContext context, IAppCurrentUser currentUser)
    : IRequestHandler<UpdateEquipmentCommand, Unit>
{
    public async Task<Unit> Handle(UpdateEquipmentCommand request, CancellationToken ct)
    {
        if (!currentUser.IsAdmin && !currentUser.IsEmployee)
            throw new UnauthorizedAccessException("Only admins and employees can update equipment.");

        var equipment = await context.Equipment
            .Include(x => x.Items)
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct);

        if (equipment is null)
            throw new UniStayNotFoundException($"Equipment with Id {request.Id} not found.");

        if (!string.IsNullOrWhiteSpace(request.Name))
        {
            var name = request.Name.Trim();
            var exists = await context.Equipment
                .AnyAsync(x => x.Id != request.Id && x.Name.ToLower() == name.ToLower(), ct);

            if (exists)
                throw new UniStayConflictException("Equipment name already exists.");

            equipment.Name = name;
        }

        equipment.Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim();
        equipment.RentalPrice = string.IsNullOrWhiteSpace(request.RentalPrice) ? null : request.RentalPrice.Trim();
        equipment.EquipmentType = string.IsNullOrWhiteSpace(request.EquipmentType) ? null : request.EquipmentType.Trim();

        await SyncItemsAsync(equipment, request.Quantity, request.AvailableQuantity, ct);
        await context.SaveChangesAsync(ct);

        return Unit.Value;
    }

    private static Task SyncItemsAsync(EquipmentEntity equipment, int targetQuantity, int targetAvailableQuantity, CancellationToken ct)
    {
        var currentQuantity = equipment.Items.Count;

        for (var i = currentQuantity + 1; i <= targetQuantity; i++)
        {
            equipment.Items.Add(new EquipmentItemEntity
            {
                SerialNumber = $"{equipment.Name}-{i}",
                IsAvailable = true
            });
        }

        var removable = equipment.Items
            .Where(x => x.IsAvailable)
            .OrderByDescending(x => x.Id)
            .Take(Math.Max(0, equipment.Items.Count - targetQuantity))
            .ToList();

        foreach (var item in removable)
            equipment.Items.Remove(item);

        var availableItems = equipment.Items.OrderBy(x => x.Id).ToList();
        for (var i = 0; i < availableItems.Count; i++)
        {
            var shouldBeAvailable = i < targetAvailableQuantity;
            availableItems[i].IsAvailable = shouldBeAvailable;

            if (shouldBeAvailable)
            {
                availableItems[i].AssignedAtUtc = null;
                availableItems[i].ReturnedAtUtc = null;
                availableItems[i].Location = null;
                availableItems[i].StudentId = null;
                availableItems[i].EmployeeId = null;
            }
        }

        return Task.CompletedTask;
    }
}
