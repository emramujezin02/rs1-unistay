namespace UniStay.Application.Modules.Housing.Halls.Queries.GetById;

public sealed class GetHallByIdQueryValidator : AbstractValidator<GetHallByIdQuery>
{
    public GetHallByIdQueryValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0);
    }
}
