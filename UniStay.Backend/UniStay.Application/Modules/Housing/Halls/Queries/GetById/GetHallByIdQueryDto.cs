namespace UniStay.Application.Modules.Housing.Halls.Queries.GetById;

public sealed class GetHallByIdQueryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public string? Description { get; set; }
    public DateTime AvailableFrom { get; set; }
    public DateTime AvailableTo { get; set; }
    public bool IsAvailable { get; set; }
}
