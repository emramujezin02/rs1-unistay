namespace UniStay.Application.Modules.HallReservations.Queries.GetMyReservations;

public sealed record GetMyReservationsResult(IReadOnlyList<ReservationListItemResult> Items);

public sealed record ReservationListItemResult(
    int ReservationId,
    int HallId,
    string HallName,
    int HallCapacity,
    DateTime FromDate,
    DateTime ToDate,
    string Status,
    DateTime CreatedAt);
