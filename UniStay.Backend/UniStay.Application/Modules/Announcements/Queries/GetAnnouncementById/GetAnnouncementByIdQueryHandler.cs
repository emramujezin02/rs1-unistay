namespace UniStay.Application.Modules.Announcements.Queries.GetAnnouncementById;

public sealed class GetAnnouncementByIdQueryHandler(IAppDbContext context)
    : IRequestHandler<GetAnnouncementByIdQuery, GetAnnouncementByIdResult>
{
    public async Task<GetAnnouncementByIdResult> Handle(GetAnnouncementByIdQuery request, CancellationToken ct)
    {
        var announcement = await context.Announcements
            .AsNoTracking()
            .Include(x => x.CreatedByUser)
            .FirstOrDefaultAsync(x => x.Id == request.AnnouncementId, ct)
            ?? throw new UniStayNotFoundException($"Announcement {request.AnnouncementId} not found.");

        var isActive = announcement.ExpiresAtUtc is null || announcement.ExpiresAtUtc > DateTime.UtcNow;

        return new GetAnnouncementByIdResult(
            announcement.Id,
            announcement.Title,
            announcement.Content,
            announcement.Audience,
            announcement.CreatedAtUtc,
            announcement.ExpiresAtUtc,
            isActive,
            announcement.CreatedByUserId,
            announcement.CreatedByUser?.Username ?? string.Empty);
    }
}
