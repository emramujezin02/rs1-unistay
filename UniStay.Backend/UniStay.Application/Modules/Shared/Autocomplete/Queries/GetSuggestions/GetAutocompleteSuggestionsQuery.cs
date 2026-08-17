namespace UniStay.Application.Modules.Shared.Autocomplete.Queries.GetSuggestions;

public sealed class GetAutocompleteSuggestionsQuery : IRequest<IReadOnlyList<object>>
{
    public string Entity { get; set; } = string.Empty;
    public string Term { get; set; } = string.Empty;
}
