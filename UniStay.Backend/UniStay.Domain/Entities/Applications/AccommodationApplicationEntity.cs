using UniStay.Domain.Common;
using UniStay.Domain.Entities.Housing;
using UniStay.Domain.Entities.Identity;

namespace UniStay.Domain.Entities.Applications;

public sealed class AccommodationApplicationEntity : BaseEntity
{
    public DateTime AppliedAtUtc { get; set; }
    public DateTime? DecisionAtUtc { get; set; }

    public string PreferredRoomType { get; set; } = string.Empty;
    public int? PreferredRoomId { get; set; }
    public RoomEntity? PreferredRoom { get; set; }

    public int YearOfStudy { get; set; }
    public decimal? GpaScore { get; set; }
    public string? PhoneNumber { get; set; }
    public string? SpecialRequirements { get; set; }
    public string? DocumentNames { get; set; }
    public string? Notes { get; set; }
    public ApplicationStatusType Status { get; set; } = ApplicationStatusType.Pending;

    public int StudentId { get; set; }
    public UniStayUserEntity? Student { get; set; }

    public int? AssignedRoomId { get; set; }
    public RoomEntity? AssignedRoom { get; set; }

    public int? DecisionByUserId { get; set; }
    public UniStayUserEntity? DecisionByUser { get; set; }

    public static class Constraints
    {
        public const int PreferredRoomTypeMaxLength = 100;
        public const int PhoneNumberMaxLength = 30;
        public const int SpecialRequirementsMaxLength = 1000;
        public const int DocumentNamesMaxLength = 2000;
        public const int NotesMaxLength = 2000;
        public const int StatusMaxLength = 20;
    }
}
