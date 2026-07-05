using UniStay.Domain.Common;
using UniStay.Domain.Entities.Identity;

namespace UniStay.Domain.Entities.Housing;

public class EquipmentItemEntity : BaseEntity
{
    public DateTime? AssignedAtUtc { get; set; }
    public DateTime? ReturnedAtUtc { get; set; }
    public int EquipmentId { get; set; }
    public EquipmentEntity Equipment { get; set; } = null!;
    public int? StudentId { get; set; }
    public UniStayUserEntity? Student { get; set; }
    public int? EmployeeId { get; set; }
    public UniStayUserEntity? Employee { get; set; }
    public string? SerialNumber { get; set; }
    public string? Location { get; set; }
    public bool IsAvailable { get; set; }

    public static class Constraints
    {
        public const int SerialNumberMaxLength = 150;
        public const int LocationMaxLength = 200;
    }
}
