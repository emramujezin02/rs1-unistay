namespace UniStay.Application.Modules.Housing.Beds.Queries.ListFree;

public sealed class ListFreeBedsQuery : BasePagedQuery<ListFreeBedsQueryDto>
{
    public string? Q { get; init; }
    public int? RoomId { get; init; }
    public DateTime? FromDate { get; init; }
    public DateTime? ToDate { get; init; }
}
