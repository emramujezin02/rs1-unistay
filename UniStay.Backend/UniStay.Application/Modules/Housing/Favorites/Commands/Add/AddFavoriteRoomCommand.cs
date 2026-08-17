namespace UniStay.Application.Modules.Housing.Favorites.Commands.Add;

public sealed class AddFavoriteRoomCommand : IRequest<Unit>
{
    public int RoomId { get; set; }
}
