namespace UniStay.Application.Modules.AccommodationApplications.Queries.GetApplicationById;

public sealed class GetApplicationByIdQueryValidator : AbstractValidator<GetApplicationByIdQuery>
{
    public GetApplicationByIdQueryValidator()
    {
        RuleFor(x => x.ApplicationId)
            .GreaterThan(0).WithMessage("ApplicationId is required.");
    }
}
