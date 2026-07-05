using UniStay.Domain.Common;

namespace UniStay.Domain.Entities.Housing;

public sealed class RoomEntity : BaseEntity
{
    public string RoomNumber { get; set; } = string.Empty;
    public int Floor { get; set; }
    public int MaxOccupancy { get; set; }
    public string Description { get; set; } = string.Empty;
    public string? Building { get; set; }
    public string? RoomSide { get; set; }
    public bool NearExit { get; set; }
    public bool WheelchairAccessible { get; set; }
    public bool ElevatorAccess { get; set; }
    public int? HallId { get; set; }
    public HallEntity? Hall { get; set; }

    public ICollection<BedEntity> Beds { get; private set; } = new List<BedEntity>();
    public ICollection<RoomImageEntity> Images { get; private set; } = new List<RoomImageEntity>();
    public ICollection<FavoriteRoomEntity> Favorites { get; private set; } = new List<FavoriteRoomEntity>();
    public ICollection<RoomReviewEntity> Reviews { get; private set; } = new List<RoomReviewEntity>();

    public static class Constraints
    {
        public const int RoomNumberMaxLength = 50;
        public const int DescriptionMaxLength = 1000;
        public const int BuildingMaxLength = 100;
        public const int RoomSideMaxLength = 50;
        public const int MinOccupancy = 1;
        public const int MaxOccupancy = 2;
    }
}
