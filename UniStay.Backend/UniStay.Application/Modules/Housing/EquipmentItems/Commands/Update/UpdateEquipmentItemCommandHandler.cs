namespace UniStay.Application.Modules.Housing.EquipmentItems.Commands.Update;

public sealed class UpdateEquipmentItemCommandHandler(IAppDbContext context)
    : IRequestHandler<UpdateEquipmentItemCommand, Unit>
{
    public async Task<Unit> Handle(UpdateEquipmentItemCommand request, CancellationToken ct)
    {
        var item = await context.EquipmentItems.FirstOrDefaultAsync(x => x.Id == request.Id, ct);

        if (item is null)
            throw new UniStayNotFoundException($"Equipment item with Id {request.Id} not found.");

        item.SerialNumber = string.IsNullOrWhiteSpace(request.SerialNumber) ? null : request.SerialNumber.Trim();
        item.IsAvailable = request.IsAvailable;
        item.AssignedAtUtc = request.IsAvailable ? null : request.AssignedAtUtc;
        item.ReturnedAtUtc = request.IsAvailable ? null : request.ReturnedAtUtc;
        item.Location = request.IsAvailable || string.IsNullOrWhiteSpace(request.Location) ? null : request.Location.Trim();

        if (request.IsAvailable)
        {
            item.StudentId = null;
            item.EmployeeId = null;
        }

        await context.SaveChangesAsync(ct);
        return Unit.Value;
    }
}
