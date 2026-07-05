namespace UniStay.Application.Modules.Housing.Rooms.Queries.List;

public sealed class ListRoomsQuery : BasePagedQuery<ListRoomsQueryDto>
{
    public string? Q { get; set; }
    public string? SearchTerm { get; set; }
    public int? Floor { get; set; }
    public string? Building { get; set; }
    public string? RoomSide { get; set; }
    public bool? NearExit { get; set; }
    public bool? WheelchairAccessible { get; set; }
    public bool? ElevatorAccess { get; set; }
    public int? MaxOccupancy { get; set; }
    public int? PageNumber { get; set; }
    public int? PageSize { get; set; }
}
