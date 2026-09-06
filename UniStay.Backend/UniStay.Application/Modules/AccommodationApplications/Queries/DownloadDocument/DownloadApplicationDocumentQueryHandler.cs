using UniStay.Domain.Entities.Applications;

namespace UniStay.Application.Modules.AccommodationApplications.Queries.DownloadDocument;

public sealed class DownloadApplicationDocumentQueryHandler(
    IAppDbContext context,
    IAppCurrentUser currentUser,
    IFileStorageService fileStorage)
    : IRequestHandler<DownloadApplicationDocumentQuery, DownloadApplicationDocumentResult>
{
    public async Task<DownloadApplicationDocumentResult> Handle(
        DownloadApplicationDocumentQuery request,
        CancellationToken ct)
    {
        var callerId = currentUser.UserId
            ?? throw new UnauthorizedAccessException("You must be logged in.");

        var application = await context.AccommodationApplications
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == request.ApplicationId, ct)
            ?? throw new UniStayNotFoundException($"Application {request.ApplicationId} not found.");

        if (!CanAccess(application, callerId))
            throw new UnauthorizedAccessException("You are not authorised to access this document.");

        var document = ApplicationDocumentReference.TryFind(application.DocumentNames, request.FileId)
            ?? throw new UniStayNotFoundException("Document not found.");

        var file = await fileStorage.OpenReadAsync(document.FileId, ct);
        return new DownloadApplicationDocumentResult(
            file.Content,
            document.DisplayName,
            file.ContentType);
    }

    private bool CanAccess(AccommodationApplicationEntity application, int callerId)
    {
        return application.StudentId == callerId
            || currentUser.IsAdmin
            || currentUser.IsEmployee;
    }
}
