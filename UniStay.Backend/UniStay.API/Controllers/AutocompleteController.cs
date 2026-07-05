using UniStay.Application.Modules.Shared.Autocomplete.Queries.GetSuggestions;

namespace UniStay.API.Controllers;

[ApiController]
[Authorize]
[Route("api/autocomplete")]
public sealed class AutocompleteController(ISender sender) : ControllerBase
{
    [HttpGet]
    public async Task<IReadOnlyList<object>> GetSuggestions(
        [FromQuery] GetAutocompleteSuggestionsQuery query,
        CancellationToken ct)
    {
        return await sender.Send(query, ct);
    }
}
