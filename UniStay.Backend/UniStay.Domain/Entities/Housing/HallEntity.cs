using UniStay.Domain.Common;

namespace UniStay.Domain.Entities.Housing;

public class HallEntity : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public string? Description { get; set; }
    public DateTime AvailableFrom { get; set; }
    public DateTime AvailableTo { get; set; }
    public bool IsAvailable { get; set; }
    public ICollection<RoomEntity> Rooms { get; private set; } = new List<RoomEntity>();
    public ICollection<UniStay.Domain.Entities.Reservations.HallReservationEntity> HallReservations { get; private set; } = new List<UniStay.Domain.Entities.Reservations.HallReservationEntity>();

    public static class Constraints
    {
        public const int NameMaxLength = 100;
        public const int DescriptionMaxLength = 1000;
        public const int MinCapacity = 1;
        public const int MaxCapacity = 1000;
    }
}
