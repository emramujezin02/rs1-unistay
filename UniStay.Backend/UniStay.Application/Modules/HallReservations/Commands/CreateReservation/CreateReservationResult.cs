namespace UniStay.Application.Modules.HallReservations.Commands.CreateReservation;

public sealed record CreateReservationResult(
    int ReservationId,
    string HallName,
    DateTime FromDate,
    DateTime ToDate,
    string Status);
