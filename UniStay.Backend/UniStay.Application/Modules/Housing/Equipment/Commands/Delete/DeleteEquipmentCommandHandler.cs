namespace UniStay.Application.Modules.Housing.Equipment.Commands.Delete;

public sealed class DeleteEquipmentCommandHandler(IAppDbContext context, IAppCurrentUser currentUser)
    : IRequestHandler<DeleteEquipmentCommand, Unit>
{
    public async Task<Unit> Handle(DeleteEquipmentCommand request, CancellationToken ct)
    {
        if (!currentUser.IsAdmin && !currentUser.IsEmployee)
            throw new UnauthorizedAccessException("Only admins and employees can delete equipment.");

        var equipment = await context.Equipment
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct);

        if (equipment is null)
            throw new UniStayNotFoundException($"Equipment with Id {request.Id} not found.");

        context.Equipment.Remove(equipment);
        await context.SaveChangesAsync(ct);

        return Unit.Value;
    }
}
