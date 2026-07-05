namespace UniStay.Application.Modules.Housing.EquipmentItems.Commands.Create;

public sealed class CreateEquipmentItemCommand : IRequest<int>
{
    [JsonIgnore]
    public int EquipmentId { get; set; }
    public string? SerialNumber { get; set; }
    public bool IsAvailable { get; set; } = true;
    public DateTime? AssignedAtUtc { get; set; }
    public DateTime? ReturnedAtUtc { get; set; }
    public string? Location { get; set; }
}
