namespace UniStay.Application.Modules.Announcements.Queries.GetAnnouncementById;

public sealed record GetAnnouncementByIdQuery(int AnnouncementId) : IRequest<GetAnnouncementByIdResult>;
