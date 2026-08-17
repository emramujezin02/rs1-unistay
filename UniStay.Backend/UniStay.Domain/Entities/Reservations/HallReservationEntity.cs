using UniStay.Domain.Common;
using UniStay.Domain.Entities.Housing;
using UniStay.Domain.Entities.Identity;

namespace UniStay.Domain.Entities.Reservations;

public sealed class HallReservationEntity : BaseEntity
{
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public ReservationStatusType Status { get; set; } = ReservationStatusType.Pending;

    public int HallId { get; set; }
    public HallEntity? Hall { get; set; }

    public int StudentId { get; set; }
    public UniStayUserEntity? Student { get; set; }
}
