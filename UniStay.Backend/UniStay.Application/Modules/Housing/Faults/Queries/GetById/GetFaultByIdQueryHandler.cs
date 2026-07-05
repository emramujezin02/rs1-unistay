namespace UniStay.Application.Modules.Housing.Faults.Queries.GetById;

public sealed class GetFaultByIdQueryHandler(IAppDbContext context)
    : IRequestHandler<GetFaultByIdQuery, GetFaultByIdQueryDto>
{
    public async Task<GetFaultByIdQueryDto> Handle(GetFaultByIdQuery request, CancellationToken ct)
    {
        var fault = await context.Faults
            .AsNoTracking()
            .Where(x => x.Id == request.Id)
            .Select(x => new GetFaultByIdQueryDto
            {
                Id = x.Id,
                Title = x.Title,
                Description = x.Description,
                Status = x.Status,
                ReportedAtUtc = x.ReportedAtUtc,
                ResolvedAtUtc = x.ResolvedAtUtc,
                Priority = x.Priority,
                IsResolved = x.IsResolved,
                ReportedByUserId = x.ReportedByUserId,
                ReportedByUserName = x.ReportedByUser == null
                    ? null
                    : (x.ReportedByUser.Firstname + " " + x.ReportedByUser.Lastname).Trim(),
                RoomId = x.RoomId
            })
            .FirstOrDefaultAsync(ct);

        if (fault is null)
            throw new UniStayNotFoundException($"Fault with Id {request.Id} not found.");

        return fault;
    }
}
