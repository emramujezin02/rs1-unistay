namespace UniStay.Application.Modules.AccommodationApplications.Queries.GetApplicationById;

public sealed record GetApplicationByIdQuery(int ApplicationId) : IRequest<GetApplicationByIdResult>;
