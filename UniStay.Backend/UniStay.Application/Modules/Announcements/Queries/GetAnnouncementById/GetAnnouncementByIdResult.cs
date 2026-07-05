namespace UniStay.Application.Modules.Announcements.Queries.GetAnnouncementById;

public sealed record GetAnnouncementByIdResult(
    int AnnouncementId,
    string Title,
    string Content,
    string Audience,
    DateTime CreatedAtUtc,
    DateTime? ExpiresAtUtc,
    bool IsActive,
    int CreatedByUserId,
    string CreatedByUsername);
