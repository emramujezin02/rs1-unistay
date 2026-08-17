namespace UniStay.Application.Modules.Housing.Halls.Queries.List;

public sealed class ListHallsQuery : BasePagedQuery<ListHallsQueryDto>
{
    public string? Name { get; init; }
    public int? MinCapacity { get; init; }
    public int? MaxCapacity { get; init; }
    public bool? IsAvailable { get; init; }
    public DateTime? Date { get; init; }
}
