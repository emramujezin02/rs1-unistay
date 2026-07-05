namespace UniStay.Application.Modules.Shared.Autocomplete.Queries.GetSuggestions;

public sealed class GetAutocompleteSuggestionsQueryHandler(IAppDbContext context)
    : IRequestHandler<GetAutocompleteSuggestionsQuery, IReadOnlyList<object>>
{
    private const int SuggestionLimit = 5;

    public async Task<IReadOnlyList<object>> Handle(GetAutocompleteSuggestionsQuery request, CancellationToken ct)
    {
        var entity = request.Entity.Trim().ToLowerInvariant();
        var term = request.Term.Trim().ToLowerInvariant();

        if (string.IsNullOrWhiteSpace(term))
            return [];

        return entity switch
        {
            "halls" => await GetHallSuggestions(term, ct),
            "equipment" => await GetEquipmentSuggestions(term, ct),
            "equipmenttype" => await GetEquipmentTypeSuggestions(term, ct),
            "faults" => await GetFaultSuggestions(term, ct),
            _ => throw new UniStayBusinessRuleException("autocomplete.entity.invalid", "Invalid autocomplete entity.")
        };
    }

    private async Task<IReadOnlyList<object>> GetHallSuggestions(string term, CancellationToken ct)
    {
        var suggestions = await context.Halls
            .AsNoTracking()
            .Where(x => x.Name.ToLower().Contains(term))
            .Select(x => x.Name)
            .Distinct()
            .OrderBy(x => x)
            .Take(SuggestionLimit)
            .ToListAsync(ct);

        return suggestions.Cast<object>().ToList();
    }

    private async Task<IReadOnlyList<object>> GetEquipmentSuggestions(string term, CancellationToken ct)
    {
        var suggestions = await context.Equipment
            .AsNoTracking()
            .Where(x => x.Name.ToLower().Contains(term))
            .Select(x => new
            {
                x.Name,
                x.EquipmentType
            })
            .Distinct()
            .OrderBy(x => x.Name)
            .Take(SuggestionLimit)
            .Select(x => new GetAutocompleteSuggestionsQueryDto
            {
                Value = x.Name,
                Name = x.Name,
                EquipmentType = x.EquipmentType
            })
            .ToListAsync(ct);

        return suggestions.Cast<object>().ToList();
    }

    private async Task<IReadOnlyList<object>> GetEquipmentTypeSuggestions(string term, CancellationToken ct)
    {
        var suggestions = await context.Equipment
            .AsNoTracking()
            .Where(x => x.EquipmentType != null && x.EquipmentType.ToLower().Contains(term))
            .Select(x => x.EquipmentType!)
            .Distinct()
            .OrderBy(x => x)
            .Take(SuggestionLimit)
            .Select(x => new GetAutocompleteSuggestionsQueryDto
            {
                Value = x,
                EquipmentType = x
            })
            .ToListAsync(ct);

        return suggestions.Cast<object>().ToList();
    }

    private async Task<IReadOnlyList<object>> GetFaultSuggestions(string term, CancellationToken ct)
    {
        var suggestions = await context.Faults
            .AsNoTracking()
            .Where(x => x.Title.ToLower().Contains(term))
            .Select(x => x.Title)
            .Distinct()
            .OrderBy(x => x)
            .Take(SuggestionLimit)
            .ToListAsync(ct);

        return suggestions.Cast<object>().ToList();
    }
}
