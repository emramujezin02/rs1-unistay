namespace UniStay.Application.Modules.Announcements.Queries.GetAnnouncements;

public sealed record GetAnnouncementsQuery(
    int PageNumber = 1,
    int PageSize = 10,
    string? Audiences = null)
    : IRequest<GetAnnouncementsResult>;
