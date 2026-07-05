using UniStay.Domain.Common;

namespace UniStay.Domain.Entities.Housing;

public sealed class BedEntity : BaseEntity
{
    public string BedNumber { get; set; } = string.Empty;
    public int RoomId { get; set; }
    public RoomEntity Room { get; set; } = null!;
    public ICollection<BedAssignmentEntity> Assignments { get; private set; } = new List<BedAssignmentEntity>();
}
