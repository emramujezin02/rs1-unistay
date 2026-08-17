namespace UniStay.Application.Modules.Housing.Halls.Queries.GetById;

public sealed class GetHallByIdQueryHandler(IAppDbContext context)
    : IRequestHandler<GetHallByIdQuery, GetHallByIdQueryDto>
{
    public async Task<GetHallByIdQueryDto> Handle(GetHallByIdQuery request, CancellationToken ct)
    {
        var hall = await context.Halls
            .AsNoTracking()
            .Where(x => x.Id == request.Id)
            .Select(x => new GetHallByIdQueryDto
            {
                Id = x.Id,
                Name = x.Name,
                Capacity = x.Capacity,
                Description = x.Description,
                AvailableFrom = x.AvailableFrom,
                AvailableTo = x.AvailableTo,
                IsAvailable = x.IsAvailable
            })
            .FirstOrDefaultAsync(ct);

        if (hall is null)
            throw new UniStayNotFoundException($"Hall with Id {request.Id} not found.");

        return hall;
    }
}
