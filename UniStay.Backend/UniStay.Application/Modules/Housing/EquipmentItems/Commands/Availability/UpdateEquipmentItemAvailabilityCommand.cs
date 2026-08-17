namespace UniStay.Application.Modules.Housing.EquipmentItems.Commands.Availability;

public sealed class UpdateEquipmentItemAvailabilityCommand : IRequest<Unit>
{
    public int Id { get; set; }
    public bool IsAvailable { get; set; }
}
