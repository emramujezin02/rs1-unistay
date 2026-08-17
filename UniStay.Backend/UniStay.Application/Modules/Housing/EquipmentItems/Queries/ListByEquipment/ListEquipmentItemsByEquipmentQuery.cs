namespace UniStay.Application.Modules.Housing.EquipmentItems.Queries.ListByEquipment;

public sealed class ListEquipmentItemsByEquipmentQuery : IRequest<IReadOnlyList<ListEquipmentItemsByEquipmentQueryDto>>
{
    public int EquipmentId { get; set; }
}
