namespace UniStay.Application.Modules.Housing.Rooms.Commands.Delete;

public sealed class DeleteRoomCommandValidator : AbstractValidator<DeleteRoomCommand>
{
    public DeleteRoomCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0);
    }
}
