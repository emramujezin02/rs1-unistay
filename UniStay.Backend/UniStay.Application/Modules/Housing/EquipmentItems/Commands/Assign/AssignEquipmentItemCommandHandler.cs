namespace UniStay.Application.Modules.Housing.EquipmentItems.Commands.Assign;

public sealed class AssignEquipmentItemCommandHandler(IAppDbContext context)
    : IRequestHandler<AssignEquipmentItemCommand, Unit>
{
    public async Task<Unit> Handle(AssignEquipmentItemCommand request, CancellationToken ct)
    {
        var item = await context.EquipmentItems.FirstOrDefaultAsync(x => x.Id == request.EquipmentItemId, ct);

        if (item is null)
            throw new UniStayNotFoundException($"Equipment item with Id {request.EquipmentItemId} not found.");

        item.IsAvailable = false;
        item.AssignedAtUtc = request.AssignedAtUtc;
        item.ReturnedAtUtc = request.ReturnedAtUtc;
        item.Location = string.IsNullOrWhiteSpace(request.Location) ? null : request.Location.Trim();
        item.StudentId = request.StudentId;
        item.EmployeeId = request.EmployeeId;

        await context.SaveChangesAsync(ct);
        return Unit.Value;
    }
}
