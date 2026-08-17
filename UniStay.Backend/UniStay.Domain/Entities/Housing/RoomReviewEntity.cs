using UniStay.Domain.Common;
using UniStay.Domain.Entities.Identity;

namespace UniStay.Domain.Entities.Housing;

public sealed class RoomReviewEntity : BaseEntity
{
    public int RoomId { get; set; }
    public RoomEntity Room { get; set; } = null!;

    public int UserId { get; set; }
    public UniStayUserEntity User { get; set; } = null!;

    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;

    public ICollection<ReviewReactionEntity> Reactions { get; private set; } = new List<ReviewReactionEntity>();

    public static class Constraints
    {
        public const int MinRating = 1;
        public const int MaxRating = 5;
        public const int CommentMaxLength = 1000;
    }
}
