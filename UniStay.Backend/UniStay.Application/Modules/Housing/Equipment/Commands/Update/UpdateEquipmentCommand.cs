namespace UniStay.Application.Modules.Housing.Equipment.Commands.Update;

public sealed class UpdateEquipmentCommand : IRequest<Unit>
{
    [JsonIgnore]
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public int Quantity { get; set; }
    public int AvailableQuantity { get; set; }
    public string? RentalPrice { get; set; }
    public string? EquipmentType { get; set; }
}
