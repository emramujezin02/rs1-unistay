namespace UniStay.Application.Modules.Housing.Beds.Queries.List;

public sealed class ListBedsQueryDto
{
    public int BedId { get; set; }
    public string BedNumber { get; set; } = string.Empty;
    public int RoomID { get; set; }
    public string RoomNumber { get; set; } = string.Empty;
}
