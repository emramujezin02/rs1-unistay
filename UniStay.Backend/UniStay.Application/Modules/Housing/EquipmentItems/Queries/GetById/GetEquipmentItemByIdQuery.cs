namespace UniStay.Application.Modules.Housing.EquipmentItems.Queries.GetById;

public sealed class GetEquipmentItemByIdQuery : IRequest<GetEquipmentItemByIdQueryDto>
{
    public int Id { get; set; }
}
