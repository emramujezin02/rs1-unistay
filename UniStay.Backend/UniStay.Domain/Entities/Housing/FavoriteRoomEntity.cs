using UniStay.Domain.Common;
using UniStay.Domain.Entities.Identity;

namespace UniStay.Domain.Entities.Housing;

public sealed class FavoriteRoomEntity : BaseEntity
{
    public int RoomId { get; set; }
    public RoomEntity Room { get; set; } = null!;

    public int UserId { get; set; }
    public UniStayUserEntity User { get; set; } = null!;
}
