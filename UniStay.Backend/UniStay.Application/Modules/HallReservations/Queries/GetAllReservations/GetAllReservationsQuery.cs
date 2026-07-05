namespace UniStay.Application.Modules.HallReservations.Queries.GetAllReservations;

public sealed record GetAllReservationsQuery(
    int? HallId,
    string? Status,
    int PageNumber = 1,
    int PageSize = 10) : IRequest<GetAllReservationsResult>;
