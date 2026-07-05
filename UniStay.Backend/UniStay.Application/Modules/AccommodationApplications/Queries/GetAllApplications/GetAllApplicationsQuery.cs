namespace UniStay.Application.Modules.AccommodationApplications.Queries.GetAllApplications;

public sealed record GetAllApplicationsQuery(
    string? Status,
    string? SearchTerm,
    int PageNumber = 1,
    int PageSize = 10) : IRequest<GetAllApplicationsResult>;
