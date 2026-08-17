namespace UniStay.Application.Modules.Housing.Favorites.Queries.ListMy;

public sealed class ListMyFavoriteRoomsQueryHandler(IAppDbContext context, IAppCurrentUser currentUser)
    : IRequestHandler<ListMyFavoriteRoomsQuery, IReadOnlyList<ListMyFavoriteRoomsQueryDto>>
{
    public async Task<IReadOnlyList<ListMyFavoriteRoomsQueryDto>> Handle(ListMyFavoriteRoomsQuery request, CancellationToken ct)
    {
        var userId = currentUser.UserId
            ?? throw new UniStayBusinessRuleException("auth.required", "User must be authenticated.");

        var favorites = await context.FavoriteRooms
            .AsNoTracking()
            .Include(x => x.Room)
            .ThenInclude(x => x.Images)
            .Where(x => x.UserId == userId)
            .OrderBy(x => x.Room.RoomNumber)
            .ToListAsync(ct);

        return favorites
            .Select(x => new ListMyFavoriteRoomsQueryDto
            {
                RoomId = x.RoomId,
                RoomNumber = x.Room.RoomNumber,
                Floor = x.Room.Floor,
                MaxOccupancy = x.Room.MaxOccupancy,
                Images = x.Room.Images.Select(i => i.ImageUrl).ToList()
            })
            .ToList();
    }
}
