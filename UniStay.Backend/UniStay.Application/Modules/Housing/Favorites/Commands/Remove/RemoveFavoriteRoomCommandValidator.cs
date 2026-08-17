namespace UniStay.Application.Modules.Housing.Favorites.Commands.Remove;

public sealed class RemoveFavoriteRoomCommandValidator : AbstractValidator<RemoveFavoriteRoomCommand>
{
    public RemoveFavoriteRoomCommandValidator()
    {
        RuleFor(x => x.RoomId).GreaterThan(0);
    }
}
