using UniStay.Domain.Common;
using UniStay.Domain.Entities.Identity;

namespace UniStay.Domain.Entities.Housing;

public class FaultEntity : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Status { get; set; } = Statuses.Open;
    public DateTime ReportedAtUtc { get; set; }
    public DateTime? ResolvedAtUtc { get; set; }
    public string? Priority { get; set; }
    public bool IsResolved { get; set; }
    public int ReportedByUserId { get; set; }
    public UniStayUserEntity? ReportedByUser { get; set; }
    public int RoomId { get; set; }

    public static class Statuses
    {
        public const string Open = "Open";
        public const string InProgress = "InProgress";
        public const string Resolved = "Resolved";
        public const string Closed = "Closed";
    }

    public static class Priorities
    {
        public const string Low = "Low";
        public const string Medium = "Medium";
        public const string High = "High";
        public const string Critical = "Critical";
    }

    public static class Constraints
    {
        public const int TitleMinLength = 3;
        public const int TitleMaxLength = 200;
        public const int DescriptionMaxLength = 2000;
        public const int StatusMaxLength = 50;
        public const int PriorityMaxLength = 50;
    }
}
