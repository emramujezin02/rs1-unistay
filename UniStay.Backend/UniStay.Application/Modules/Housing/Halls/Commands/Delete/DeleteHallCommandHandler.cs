namespace UniStay.Application.Modules.Housing.Halls.Commands.Delete;

public sealed class DeleteHallCommandHandler(IAppDbContext context)
    : IRequestHandler<DeleteHallCommand, Unit>
{
    public async Task<Unit> Handle(DeleteHallCommand request, CancellationToken ct)
    {
        var hall = await context.Halls
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct);

        if (hall is null)
            throw new UniStayNotFoundException($"Hall with Id {request.Id} not found.");

        context.Halls.Remove(hall);
        await context.SaveChangesAsync(ct);

        return Unit.Value;
    }
}
