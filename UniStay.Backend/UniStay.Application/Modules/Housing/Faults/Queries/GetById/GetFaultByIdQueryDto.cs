namespace UniStay.Application.Modules.Housing.Faults.Queries.GetById;

public sealed class GetFaultByIdQueryDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime ReportedAtUtc { get; set; }
    public DateTime? ResolvedAtUtc { get; set; }
    public string? Priority { get; set; }
    public bool IsResolved { get; set; }
    public int ReportedByUserId { get; set; }
    public string? ReportedByUserName { get; set; }
    public int RoomId { get; set; }
}
