using UniStay.Domain.Entities.Housing;

namespace UniStay.Application.Modules.Housing.Halls.Commands.Create;

public sealed class CreateHallCommandHandler(IAppDbContext context)
    : IRequestHandler<CreateHallCommand, int>
{
    public async Task<int> Handle(CreateHallCommand request, CancellationToken ct)
    {
        var name = request.Name.Trim();

        var exists = await context.Halls
            .AnyAsync(x => x.Name.ToLower() == name.ToLower(), ct);

        if (exists)
            throw new UniStayConflictException("Hall name already exists.");

        var hall = new HallEntity
        {
            Name = name,
            Capacity = request.Capacity,
            Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim(),
            AvailableFrom = request.AvailableFrom,
            AvailableTo = request.AvailableTo,
            IsAvailable = request.IsAvailable
        };

        context.Halls.Add(hall);
        await context.SaveChangesAsync(ct);

        return hall.Id;
    }
}
