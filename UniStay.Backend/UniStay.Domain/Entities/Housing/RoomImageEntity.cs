using UniStay.Domain.Common;

namespace UniStay.Domain.Entities.Housing;

public sealed class RoomImageEntity : BaseEntity
{
    public string ImageUrl { get; set; } = string.Empty;
    public int RoomId { get; set; }
    public RoomEntity Room { get; set; } = null!;
}
