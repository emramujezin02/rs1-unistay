namespace UniStay.Application.Modules.AccommodationApplications.Queries.DownloadDocument;

public sealed class DownloadApplicationDocumentQueryValidator : AbstractValidator<DownloadApplicationDocumentQuery>
{
    public DownloadApplicationDocumentQueryValidator()
    {
        RuleFor(x => x.ApplicationId).GreaterThan(0);
        RuleFor(x => x.FileId).NotEmpty();
    }
}
