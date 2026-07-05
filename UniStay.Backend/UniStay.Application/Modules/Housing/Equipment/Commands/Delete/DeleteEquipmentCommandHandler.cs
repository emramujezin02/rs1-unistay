namespace UniStay.Application.Modules.Housing.Equipment.Commands.Delete;

public sealed class DeleteEquipmentCommandHandler(IAppDbContext context, IAppCurrentUser currentUser)
    : IRequestHandler<DeleteEquipmentCommand, Unit>
{
    public async Task<Unit> Handle(DeleteEquipmentCommand request, CancellationToken ct)
    {
        if (currentUser.UserId is null)
            throw new UniStayBusinessRuleException("AUTH_REQUIRED", "User is not authenticated.");

        var equipment = await context.Equipment
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct);

        if (equipment is null)
            throw new UniStayNotFoundException($"Equipment with Id {request.Id} not found.");

        context.Equipment.Remove(equipment);
        await context.SaveChangesAsync(ct);

        return Unit.Value;
    }
}
