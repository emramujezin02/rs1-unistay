namespace UniStay.Application.Modules.Housing.Halls.Queries.List;

public sealed class ListHallsQueryValidator : AbstractValidator<ListHallsQuery>
{
    public ListHallsQueryValidator()
    {
        RuleFor(x => x.MinCapacity)
            .GreaterThanOrEqualTo(1)
            .When(x => x.MinCapacity.HasValue);

        RuleFor(x => x.MaxCapacity)
            .GreaterThanOrEqualTo(1)
            .When(x => x.MaxCapacity.HasValue);

        RuleFor(x => x)
            .Must(x => !x.MinCapacity.HasValue || !x.MaxCapacity.HasValue || x.MinCapacity.Value <= x.MaxCapacity.Value)
            .WithMessage("MinCapacity must be less than or equal to MaxCapacity.");
    }
}
