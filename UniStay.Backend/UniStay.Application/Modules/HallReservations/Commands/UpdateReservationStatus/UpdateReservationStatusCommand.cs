namespace UniStay.Application.Modules.HallReservations.Commands.UpdateReservationStatus;

public sealed record UpdateReservationStatusCommand(
    int ReservationId,
    string Status) : IRequest<UpdateReservationStatusResult>;
