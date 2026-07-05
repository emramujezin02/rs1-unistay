namespace UniStay.Application.Modules.Housing.EquipmentItems.Commands.Availability;

public sealed class UpdateEquipmentItemAvailabilityCommandHandler(IAppDbContext context)
    : IRequestHandler<UpdateEquipmentItemAvailabilityCommand, Unit>
{
    public async Task<Unit> Handle(UpdateEquipmentItemAvailabilityCommand request, CancellationToken ct)
    {
        var item = await context.EquipmentItems.FirstOrDefaultAsync(x => x.Id == request.Id, ct);

        if (item is null)
            throw new UniStayNotFoundException($"Equipment item with Id {request.Id} not found.");

        item.IsAvailable = request.IsAvailable;

        if (request.IsAvailable)
        {
            item.AssignedAtUtc = null;
            item.ReturnedAtUtc = null;
            item.Location = null;
            item.StudentId = null;
            item.EmployeeId = null;
        }

        await context.SaveChangesAsync(ct);
        return Unit.Value;
    }
}
