namespace UniStay.Application.Modules.Announcements.Commands.CreateAnnouncement;

public sealed record CreateAnnouncementCommand(
    string Title,
    string Content,
    DateTime? ExpiresAtUtc,
    string Audience = AnnouncementEntity.Audiences.Everyone)
    : IRequest<CreateAnnouncementResult>;
