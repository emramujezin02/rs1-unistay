namespace UniStay.Application.Modules.Announcements.Commands.DeleteAnnouncement;

public sealed record DeleteAnnouncementCommand(int AnnouncementId) : IRequest<DeleteAnnouncementResult>;
