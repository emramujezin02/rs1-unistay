namespace UniStay.Application.Modules.Housing.Equipment.Queries.List;

public sealed class ListEquipmentQueryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int Quantity { get; set; }
    public int AvailableQuantity { get; set; }
    public string? RentalPrice { get; set; }
    public string? EquipmentType { get; set; }
}
