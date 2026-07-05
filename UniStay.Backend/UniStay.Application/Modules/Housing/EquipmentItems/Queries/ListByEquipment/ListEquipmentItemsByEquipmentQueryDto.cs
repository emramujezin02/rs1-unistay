namespace UniStay.Application.Modules.Housing.EquipmentItems.Queries.ListByEquipment;

public sealed class ListEquipmentItemsByEquipmentQueryDto
{
    public int Id { get; set; }
    public string? SerialNumber { get; set; }
    public bool IsAvailable { get; set; }
    public string? Location { get; set; }
    public DateTime? AssignedAtUtc { get; set; }
    public DateTime? ReturnedAtUtc { get; set; }
}
