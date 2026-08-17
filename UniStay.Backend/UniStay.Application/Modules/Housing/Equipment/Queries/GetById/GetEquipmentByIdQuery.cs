namespace UniStay.Application.Modules.Housing.Equipment.Queries.GetById;

public sealed class GetEquipmentByIdQuery : IRequest<GetEquipmentByIdQueryDto>
{
    public int Id { get; set; }
}
