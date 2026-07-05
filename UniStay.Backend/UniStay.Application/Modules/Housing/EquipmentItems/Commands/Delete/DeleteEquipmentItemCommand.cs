namespace UniStay.Application.Modules.Housing.EquipmentItems.Commands.Delete;

public sealed class DeleteEquipmentItemCommand : IRequest<Unit>
{
    public int Id { get; set; }
}
