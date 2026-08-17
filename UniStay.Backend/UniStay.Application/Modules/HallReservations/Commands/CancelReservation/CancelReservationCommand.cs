namespace UniStay.Application.Modules.HallReservations.Commands.CancelReservation;

public sealed record CancelReservationCommand(int ReservationId) : IRequest<CancelReservationResult>;
