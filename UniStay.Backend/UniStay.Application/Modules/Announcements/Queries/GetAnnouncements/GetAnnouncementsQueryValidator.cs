namespace UniStay.Application.Modules.Announcements.Queries.GetAnnouncements;

public sealed class GetAnnouncementsQueryValidator : AbstractValidator<GetAnnouncementsQuery>
{
    public GetAnnouncementsQueryValidator()
    {
        RuleFor(x => x.PageNumber)
            .GreaterThanOrEqualTo(1).WithMessage("PageNumber must be at least 1.");

        RuleFor(x => x.PageSize)
            .InclusiveBetween(1, 100).WithMessage("PageSize must be between 1 and 100.");
    }
}
