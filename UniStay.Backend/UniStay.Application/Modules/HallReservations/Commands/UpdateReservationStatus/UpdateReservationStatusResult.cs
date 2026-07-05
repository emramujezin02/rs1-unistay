namespace UniStay.Application.Modules.HallReservations.Commands.UpdateReservationStatus;

public sealed record UpdateReservationStatusResult(
    int ReservationId,
    string HallName,
    string Status);
