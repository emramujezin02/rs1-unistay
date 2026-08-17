namespace UniStay.Application.Modules.Housing.Beds.Queries.ListFree;

public sealed class ListFreeBedsQueryDto
{
    public int BedId { get; set; }
    public string BedNumber { get; set; } = string.Empty;
    public int RoomId { get; set; }
    public string RoomNumber { get; set; } = string.Empty;
    public int Floor { get; set; }
}
