namespace UniStay.Application.Modules.Housing.Rooms.Commands.Create;

public sealed class CreateRoomCommand : IRequest<int>
{
    public required string RoomNumber { get; set; }
    public int Floor { get; set; }
    public int MaxOccupancy { get; set; }
    public required string Description { get; set; }
    public string? Building { get; set; }
    public string? RoomSide { get; set; }
    public bool NearExit { get; set; }
    public bool WheelchairAccessible { get; set; }
    public bool ElevatorAccess { get; set; }
    public int? HallId { get; set; }
    public IReadOnlyList<string> Images { get; set; } = Array.Empty<string>();
}
