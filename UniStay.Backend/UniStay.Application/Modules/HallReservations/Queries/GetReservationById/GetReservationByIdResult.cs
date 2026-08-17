namespace UniStay.Application.Modules.HallReservations.Queries.GetReservationById;

public sealed record GetReservationByIdResult(
    int ReservationId,
    int HallId,
    string HallName,
    int HallCapacity,
    string? HallDescription,
    int StudentId,
    string StudentUsername,
    string StudentEmail,
    string StudentFirstName,
    string StudentLastName,
    DateTime FromDate,
    DateTime ToDate,
    string Status,
    DateTime CreatedAt);
