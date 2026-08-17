namespace UniStay.Application.Modules.Housing.Favorites.Commands.Remove;

public sealed class RemoveFavoriteRoomCommand : IRequest<Unit>
{
    public int RoomId { get; set; }
}
