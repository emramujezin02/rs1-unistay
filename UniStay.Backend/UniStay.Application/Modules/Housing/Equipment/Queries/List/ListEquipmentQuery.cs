namespace UniStay.Application.Modules.Housing.Equipment.Queries.List;

public sealed class ListEquipmentQuery : BasePagedQuery<ListEquipmentQueryDto>
{
    public string? Name { get; init; }
    public string? Type { get; init; }
    public int? MinQuantity { get; init; }
    public int? MaxQuantity { get; init; }
    public bool? AvailableOnly { get; init; }
}
