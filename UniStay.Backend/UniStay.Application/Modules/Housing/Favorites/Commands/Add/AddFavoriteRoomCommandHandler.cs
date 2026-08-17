namespace UniStay.Application.Modules.Housing.Favorites.Commands.Add;

public sealed class AddFavoriteRoomCommandHandler(IAppDbContext context, IAppCurrentUser currentUser)
    : IRequestHandler<AddFavoriteRoomCommand, Unit>
{
    public async Task<Unit> Handle(AddFavoriteRoomCommand request, CancellationToken ct)
    {
        var userId = currentUser.UserId
            ?? throw new UniStayBusinessRuleException("auth.required", "User must be authenticated.");

        var roomExists = await context.Rooms.AnyAsync(x => x.Id == request.RoomId, ct);
        if (!roomExists)
            throw new UniStayNotFoundException("Room not found.");

        var existing = await context.FavoriteRooms
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(x => x.UserId == userId && x.RoomId == request.RoomId, ct);

        if (existing is null)
        {
            context.FavoriteRooms.Add(new FavoriteRoomEntity
            {
                UserId = userId,
                RoomId = request.RoomId
            });
        }
        else if (existing.IsDeleted)
        {
            existing.IsDeleted = false;
        }
        else
        {
            throw new UniStayConflictException("Room is already in favorites.");
        }

        await context.SaveChangesAsync(ct);
        return Unit.Value;
    }
}
