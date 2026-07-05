namespace UniStay.Application.Modules.Announcements.Queries.GetAnnouncements;

public sealed record GetAnnouncementsResult(
    IReadOnlyList<AnnouncementListItemResult> Items,
    int TotalCount,
    int PageNumber,
    int PageSize)
{
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
}

public sealed record AnnouncementListItemResult(
    int AnnouncementId,
    string Title,
    string Content,
    string Audience,
    DateTime CreatedAtUtc,
    DateTime? ExpiresAtUtc,
    int CreatedByUserId,
    string CreatedByUsername);
