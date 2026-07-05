namespace UniStay.Application.Modules.Housing.Equipment.Commands.Delete;

public sealed class DeleteEquipmentCommand : IRequest<Unit>
{
    public int Id { get; set; }
}
