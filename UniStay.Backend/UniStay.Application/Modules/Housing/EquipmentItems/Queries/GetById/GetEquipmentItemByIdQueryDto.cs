namespace UniStay.Application.Modules.Housing.EquipmentItems.Queries.GetById;

public sealed class GetEquipmentItemByIdQueryDto
{
    public int Id { get; set; }
    public int EquipmentId { get; set; }
    public string? SerialNumber { get; set; }
    public bool IsAvailable { get; set; }
    public string? Location { get; set; }
    public DateTime? AssignedAtUtc { get; set; }
    public DateTime? ReturnedAtUtc { get; set; }
    public int? StudentId { get; set; }
    public int? EmployeeId { get; set; }
}
