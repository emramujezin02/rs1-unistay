namespace UniStay.Application.Modules.Housing.EquipmentItems.Commands.Update;

public sealed class UpdateEquipmentItemCommand : IRequest<Unit>
{
    [JsonIgnore]
    public int Id { get; set; }
    public string? SerialNumber { get; set; }
    public bool IsAvailable { get; set; }
    public DateTime? AssignedAtUtc { get; set; }
    public DateTime? ReturnedAtUtc { get; set; }
    public string? Location { get; set; }
}
