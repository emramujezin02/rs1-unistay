using UniStay.Domain.Common;
using UniStay.Domain.Entities.Identity;

namespace UniStay.Domain.Entities.Housing;

public sealed class BedAssignmentEntity : BaseEntity
{
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }

    public int BedId { get; set; }
    public BedEntity Bed { get; set; } = null!;

    public int StudentId { get; set; }
    public UniStayUserEntity Student { get; set; } = null!;
}
