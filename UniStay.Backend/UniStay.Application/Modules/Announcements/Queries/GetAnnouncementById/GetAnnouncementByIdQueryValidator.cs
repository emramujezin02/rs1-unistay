namespace UniStay.Application.Modules.Announcements.Queries.GetAnnouncementById;

public sealed class GetAnnouncementByIdQueryValidator : AbstractValidator<GetAnnouncementByIdQuery>
{
    public GetAnnouncementByIdQueryValidator()
    {
        RuleFor(x => x.AnnouncementId)
            .GreaterThan(0).WithMessage("AnnouncementId is required.");
    }
}
