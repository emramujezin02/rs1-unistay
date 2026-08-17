using UniStay.Application.Modules.Housing.Rooms.Common;

namespace UniStay.Application.Modules.Housing.Rooms.Queries.GetById;

public sealed class GetRoomByIdQueryDto
{
    public int Id { get; set; }
    public string RoomNumber { get; set; } = string.Empty;
    public int Floor { get; set; }
    public int MaxOccupancy { get; set; }
    public string Description { get; set; } = string.Empty;
    public string? Building { get; set; }
    public string? RoomSide { get; set; }
    public bool NearExit { get; set; }
    public bool WheelchairAccessible { get; set; }
    public bool ElevatorAccess { get; set; }
    public int? HallId { get; set; }
    public IReadOnlyList<string> Images { get; set; } = Array.Empty<string>();
    public IReadOnlyList<RoomStudentDto> Students { get; set; } = Array.Empty<RoomStudentDto>();
    public IReadOnlyList<RoomBedDto> Beds { get; set; } = Array.Empty<RoomBedDto>();
}
