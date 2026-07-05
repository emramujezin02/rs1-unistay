namespace UniStay.Application.Modules.Housing.Equipment.Commands.Create;

public sealed class CreateEquipmentCommand : IRequest<int>
{
    public required string Name { get; set; }
    public string? Description { get; set; }
    public int Quantity { get; set; }
    public int AvailableQuantity { get; set; }
    public string? RentalPrice { get; set; }
    public string? EquipmentType { get; set; }
}
