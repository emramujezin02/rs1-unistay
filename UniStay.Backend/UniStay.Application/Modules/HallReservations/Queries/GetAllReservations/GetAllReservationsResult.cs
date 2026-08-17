namespace UniStay.Application.Modules.HallReservations.Queries.GetAllReservations;

public sealed record GetAllReservationsResult(
    IReadOnlyList<AdminReservationListItemResult> Items,
    int TotalCount,
    int PageNumber,
    int PageSize)
{
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
}

public sealed record AdminReservationListItemResult(
    int ReservationId,
    int HallId,
    string HallName,
    int HallCapacity,
    int StudentId,
    string StudentUsername,
    string StudentEmail,
    DateTime FromDate,
    DateTime ToDate,
    string Status,
    DateTime CreatedAt);
