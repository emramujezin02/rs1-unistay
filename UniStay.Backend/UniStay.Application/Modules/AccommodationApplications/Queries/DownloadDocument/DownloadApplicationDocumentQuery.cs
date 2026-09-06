namespace UniStay.Application.Modules.AccommodationApplications.Queries.DownloadDocument;

public sealed record DownloadApplicationDocumentQuery(
    int ApplicationId,
    string FileId) : IRequest<DownloadApplicationDocumentResult>;
