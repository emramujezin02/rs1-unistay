using UniStay.Domain.Common;
using UniStay.Domain.Entities.Identity;

namespace UniStay.Domain.Entities.Housing;

public sealed class ReviewReactionEntity : BaseEntity
{
    public int RoomReviewId { get; set; }
    public RoomReviewEntity Review { get; set; } = null!;

    public int UserId { get; set; }
    public UniStayUserEntity User { get; set; } = null!;

    public bool IsLike { get; set; }
}
