namespace UniStay.Application.Modules.Housing.Favorites.Queries.ListMy;

public sealed class ListMyFavoriteRoomsQueryDto
{
    public int RoomId { get; set; }
    public string RoomNumber { get; set; } = string.Empty;
    public int Floor { get; set; }
    public int MaxOccupancy { get; set; }
    public IReadOnlyList<string> Images { get; set; } = Array.Empty<string>();
}
