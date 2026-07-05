namespace UniStay.Application.Modules.Housing.Reviews.Commands.Create;

public sealed class CreateRoomReviewCommand : IRequest<int>
{
    public int RoomId { get; set; }
    public int Rating { get; set; }
    public required string Comment { get; set; }
}
