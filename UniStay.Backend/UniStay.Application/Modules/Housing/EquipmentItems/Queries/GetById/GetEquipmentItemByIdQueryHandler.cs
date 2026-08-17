namespace UniStay.Application.Modules.Housing.EquipmentItems.Queries.GetById;

public sealed class GetEquipmentItemByIdQueryHandler(IAppDbContext context)
    : IRequestHandler<GetEquipmentItemByIdQuery, GetEquipmentItemByIdQueryDto>
{
    public async Task<GetEquipmentItemByIdQueryDto> Handle(GetEquipmentItemByIdQuery request, CancellationToken ct)
    {
        var item = await context.EquipmentItems
            .AsNoTracking()
            .Where(x => x.Id == request.Id)
            .Select(x => new GetEquipmentItemByIdQueryDto
            {
                Id = x.Id,
                EquipmentId = x.EquipmentId,
                SerialNumber = x.SerialNumber,
                IsAvailable = x.IsAvailable,
                Location = x.Location,
                AssignedAtUtc = x.AssignedAtUtc,
                ReturnedAtUtc = x.ReturnedAtUtc,
                StudentId = x.StudentId,
                EmployeeId = x.EmployeeId
            })
            .FirstOrDefaultAsync(ct);

        if (item is null)
            throw new UniStayNotFoundException($"Equipment item with Id {request.Id} not found.");

        return item;
    }
}
