namespace UniStay.Application.Modules.Housing.Rooms.Common;

public sealed class RoomStudentDto
{
    public int UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
}
