namespace UniStay.Application.Modules.Housing.Favorites.Commands.Remove;

public sealed class RemoveFavoriteRoomCommandHandler(IAppDbContext context, IAppCurrentUser currentUser)
    : IRequestHandler<RemoveFavoriteRoomCommand, Unit>
{
    public async Task<Unit> Handle(RemoveFavoriteRoomCommand request, CancellationToken ct)
    {
        var userId = currentUser.UserId
            ?? throw new UniStayBusinessRuleException("auth.required", "User must be authenticated.");

        var favorite = await context.FavoriteRooms
            .FirstOrDefaultAsync(x => x.UserId == userId && x.RoomId == request.RoomId, ct)
            ?? throw new UniStayNotFoundException("Favorite room not found.");

        context.FavoriteRooms.Remove(favorite);
        await context.SaveChangesAsync(ct);

        return Unit.Value;
    }
}
