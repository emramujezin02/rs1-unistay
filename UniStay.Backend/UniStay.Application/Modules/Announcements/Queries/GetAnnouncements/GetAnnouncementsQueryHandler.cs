namespace UniStay.Application.Modules.Announcements.Queries.GetAnnouncements;

public sealed class GetAnnouncementsQueryHandler(IAppDbContext context)
    : IRequestHandler<GetAnnouncementsQuery, GetAnnouncementsResult>
{
    public async Task<GetAnnouncementsResult> Handle(GetAnnouncementsQuery request, CancellationToken ct)
    {
        var now = DateTime.UtcNow;

        var query = context.Announcements
            .AsNoTracking()
            .Include(x => x.CreatedByUser)
            .Where(x => x.ExpiresAtUtc == null || x.ExpiresAtUtc > now);

        if (!string.IsNullOrWhiteSpace(request.Audiences))
        {
            var audiences = request.Audiences
                .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

            query = query.Where(x => audiences.Contains(x.Audience));
        }

        var totalCount = await query.CountAsync(ct);

        var announcements = await query
            .OrderByDescending(x => x.CreatedAtUtc)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(x => new AnnouncementListItemResult(
                x.Id,
                x.Title,
                x.Content,
                x.Audience,
                x.CreatedAtUtc,
                x.ExpiresAtUtc,
                x.CreatedByUserId,
                x.CreatedByUser != null ? x.CreatedByUser.Username : string.Empty))
            .ToListAsync(ct);

        return new GetAnnouncementsResult(announcements, totalCount, request.PageNumber, request.PageSize);
    }
}
