namespace UniStay.Application.Modules.Housing.Faults.Commands.Create;

public sealed class CreateFaultCommand : IRequest<int>
{
    public required string Title { get; set; }
    public string? Description { get; set; }
    public int RoomId { get; set; }
}
