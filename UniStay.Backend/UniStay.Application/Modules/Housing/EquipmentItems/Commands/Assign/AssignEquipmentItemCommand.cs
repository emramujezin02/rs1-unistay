namespace UniStay.Application.Modules.Housing.EquipmentItems.Commands.Assign;

public sealed class AssignEquipmentItemCommand : IRequest<Unit>
{
    public int EquipmentItemId { get; set; }
    public DateTime? AssignedAtUtc { get; set; }
    public DateTime? ReturnedAtUtc { get; set; }
    public string? Location { get; set; }
    public int? StudentId { get; set; }
    public int? EmployeeId { get; set; }
}
