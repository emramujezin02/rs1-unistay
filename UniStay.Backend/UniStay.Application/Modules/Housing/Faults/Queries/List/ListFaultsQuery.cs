namespace UniStay.Application.Modules.Housing.Faults.Queries.List;

public sealed class ListFaultsQuery : BasePagedQuery<ListFaultsQueryDto>
{
    public string? Title { get; init; }
    public int? ReportedByUserId { get; init; }
    public bool? IsResolved { get; init; }
    public DateTime? From { get; init; }
    public DateTime? To { get; init; }
    public int? RoomId { get; init; }
}
