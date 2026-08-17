namespace UniStay.Application.Modules.HallReservations.Queries.GetReservationById;

public sealed record GetReservationByIdQuery(int ReservationId) : IRequest<GetReservationByIdResult>;
