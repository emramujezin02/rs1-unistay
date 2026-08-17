namespace UniStay.Application.Modules.Shared.Autocomplete.Queries.GetSuggestions;

public sealed class GetAutocompleteSuggestionsQueryDto
{
    public string Value { get; set; } = string.Empty;
    public string? Name { get; set; }
    public string? EquipmentType { get; set; }
}
