namespace UniStay.Application.Modules.Shared.Autocomplete.Queries.GetSuggestions;

public sealed class GetAutocompleteSuggestionsQueryValidator : AbstractValidator<GetAutocompleteSuggestionsQuery>
{
    private static readonly string[] AllowedEntities = ["halls", "equipment", "equipmenttype", "faults"];

    public GetAutocompleteSuggestionsQueryValidator()
    {
        RuleFor(x => x.Entity)
            .NotEmpty()
            .Must(BeAllowedEntity)
            .WithMessage("Invalid autocomplete entity.");

        RuleFor(x => x.Term)
            .MaximumLength(100);
    }

    private static bool BeAllowedEntity(string entity)
    {
        return AllowedEntities.Contains(entity.Trim().ToLowerInvariant());
    }
}
