namespace UniStay.Application.Modules.Housing.Faults.Queries.GetById;

public sealed class GetFaultByIdQueryValidator : AbstractValidator<GetFaultByIdQuery>
{
    public GetFaultByIdQueryValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0);
    }
}
