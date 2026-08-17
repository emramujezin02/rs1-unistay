namespace UniStay.Application.Modules.Housing.Rooms.Commands.Update;

public sealed class UpdateRoomCommand : IRequest<Unit>
{
    public int Id { get; set; }
    public string? RoomNumber { get; set; }
    public int? Floor { get; set; }
    public int? MaxOccupancy { get; set; }
    public string? Description { get; set; }
    public string? Building { get; set; }
    public string? RoomSide { get; set; }
    public bool? NearExit { get; set; }
    public bool? WheelchairAccessible { get; set; }
    public bool? ElevatorAccess { get; set; }
    public int? HallId { get; set; }
    public IReadOnlyList<string>? Images { get; set; }
}
