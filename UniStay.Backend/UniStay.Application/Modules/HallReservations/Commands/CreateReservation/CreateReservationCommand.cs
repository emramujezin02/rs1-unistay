namespace UniStay.Application.Modules.HallReservations.Commands.CreateReservation;

public sealed record CreateReservationCommand(
    int HallId,
    DateTime FromDate,
    DateTime ToDate) : IRequest<CreateReservationResult>;
