namespace UniStay.Application.Modules.Housing.Halls.Commands.Update;

public sealed class UpdateHallCommandHandler(IAppDbContext context)
    : IRequestHandler<UpdateHallCommand, Unit>
{
    public async Task<Unit> Handle(UpdateHallCommand request, CancellationToken ct)
    {
        var hall = await context.Halls
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct);

        if (hall is null)
            throw new UniStayNotFoundException($"Hall with Id {request.Id} not found.");

        var name = request.Name.Trim();
        var exists = await context.Halls
            .AnyAsync(x => x.Id != request.Id && x.Name.ToLower() == name.ToLower(), ct);

        if (exists)
            throw new UniStayConflictException("Hall name already exists.");

        hall.Name = name;
        hall.Capacity = request.Capacity;
        hall.Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim();
        hall.AvailableFrom = request.AvailableFrom;
        hall.AvailableTo = request.AvailableTo;
        hall.IsAvailable = request.IsAvailable;

        await context.SaveChangesAsync(ct);

        return Unit.Value;
    }
}
