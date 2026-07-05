namespace UniStay.Application.Modules.Housing.Halls.Commands.Create;

public sealed class CreateHallCommand : IRequest<int>
{
    public required string Name { get; set; }
    public int Capacity { get; set; }
    public string? Description { get; set; }
    public DateTime AvailableFrom { get; set; }
    public DateTime AvailableTo { get; set; }
    public bool IsAvailable { get; set; } = true;
}
