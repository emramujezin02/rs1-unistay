namespace UniStay.Application.Modules.Housing.Halls.Commands.Delete;

public sealed class DeleteHallCommandHandler(IAppDbContext context, IAppCurrentUser currentUser)
    : IRequestHandler<DeleteHallCommand, Unit>
{
    public async Task<Unit> Handle(DeleteHallCommand request, CancellationToken ct)
    {
        if (!currentUser.IsAdmin && !currentUser.IsEmployee)
            throw new UnauthorizedAccessException("Only admins and employees can delete halls.");

        var hall = await context.Halls
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct);

        if (hall is null)
            throw new UniStayNotFoundException($"Hall with Id {request.Id} not found.");

        context.Halls.Remove(hall);
        await context.SaveChangesAsync(ct);

        return Unit.Value;
    }
}
