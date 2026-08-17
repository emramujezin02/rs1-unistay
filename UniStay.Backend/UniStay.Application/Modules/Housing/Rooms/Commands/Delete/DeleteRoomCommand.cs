namespace UniStay.Application.Modules.Housing.Rooms.Commands.Delete;

public sealed class DeleteRoomCommand : IRequest<Unit>
{
    public int Id { get; set; }
}
