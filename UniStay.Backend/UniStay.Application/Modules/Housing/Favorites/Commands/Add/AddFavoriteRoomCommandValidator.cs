namespace UniStay.Application.Modules.Housing.Favorites.Commands.Add;

public sealed class AddFavoriteRoomCommandValidator : AbstractValidator<AddFavoriteRoomCommand>
{
    public AddFavoriteRoomCommandValidator()
    {
        RuleFor(x => x.RoomId).GreaterThan(0);
    }
}
