namespace UniStay.Application.Modules.Announcements.Commands.DeleteAnnouncement;

public sealed class DeleteAnnouncementCommandHandler(
    IAppDbContext context,
    IAppCurrentUser currentUser)
    : IRequestHandler<DeleteAnnouncementCommand, DeleteAnnouncementResult>
{
    public async Task<DeleteAnnouncementResult> Handle(DeleteAnnouncementCommand request, CancellationToken ct)
    {
        if (!currentUser.IsAdmin)
            throw new UnauthorizedAccessException("Only admins can delete announcements.");

        var announcement = await context.Announcements
            .FirstOrDefaultAsync(x => x.Id == request.AnnouncementId, ct)
            ?? throw new UniStayNotFoundException($"Announcement {request.AnnouncementId} not found.");

        context.Announcements.Remove(announcement);
        await context.SaveChangesAsync(ct);

        return new DeleteAnnouncementResult(announcement.Id);
    }
}
