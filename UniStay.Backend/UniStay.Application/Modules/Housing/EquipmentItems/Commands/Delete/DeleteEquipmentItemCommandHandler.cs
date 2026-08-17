namespace UniStay.Application.Modules.Housing.EquipmentItems.Commands.Delete;

public sealed class DeleteEquipmentItemCommandHandler(IAppDbContext context)
    : IRequestHandler<DeleteEquipmentItemCommand, Unit>
{
    public async Task<Unit> Handle(DeleteEquipmentItemCommand request, CancellationToken ct)
    {
        var item = await context.EquipmentItems.FirstOrDefaultAsync(x => x.Id == request.Id, ct);

        if (item is null)
            throw new UniStayNotFoundException($"Equipment item with Id {request.Id} not found.");

        context.EquipmentItems.Remove(item);
        await context.SaveChangesAsync(ct);

        return Unit.Value;
    }
}
