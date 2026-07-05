using UniStay.Application.Modules.Housing.Favorites.Commands.Add;
using UniStay.Application.Modules.Housing.Favorites.Commands.Remove;
using UniStay.Application.Modules.Housing.Favorites.Queries.ListMy;

namespace UniStay.API.Controllers;

[ApiController]
[Authorize]
[Route("api/favorites")]
public sealed class FavoritesController(ISender sender) : ControllerBase
{
    [HttpPost("add")]
    public async Task Add([FromQuery] int roomId, CancellationToken ct)
    {
        await sender.Send(new AddFavoriteRoomCommand { RoomId = roomId }, ct);
    }

    [HttpDelete("remove")]
    public async Task Remove([FromQuery] int roomId, CancellationToken ct)
    {
        await sender.Send(new RemoveFavoriteRoomCommand { RoomId = roomId }, ct);
    }

    [HttpGet("my")]
    public async Task<IReadOnlyList<ListMyFavoriteRoomsQueryDto>> GetMyFavorites(CancellationToken ct)
    {
        return await sender.Send(new ListMyFavoriteRoomsQuery(), ct);
    }
}
