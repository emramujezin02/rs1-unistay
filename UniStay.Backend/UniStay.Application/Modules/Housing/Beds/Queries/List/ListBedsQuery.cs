namespace UniStay.Application.Modules.Housing.Beds.Queries.List;

public sealed class ListBedsQuery : BasePagedQuery<ListBedsQueryDto>
{
    public string? Q { get; init; }
    public int? RoomId { get; init; }
}
