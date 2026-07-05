namespace UniStay.Application.Modules.Housing.Faults.Commands.Update;

public sealed class UpdateFaultCommand : IRequest<Unit>
{
    [JsonIgnore]
    public int Id { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public required string Status { get; set; }
    public string? Priority { get; set; }
    public bool? IsResolved { get; set; }
    public DateTime? ResolvedAtUtc { get; set; }
}
