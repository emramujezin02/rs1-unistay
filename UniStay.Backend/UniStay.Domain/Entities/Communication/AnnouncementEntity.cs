using UniStay.Domain.Common;
using UniStay.Domain.Entities.Identity;

namespace UniStay.Domain.Entities.Communication;

public sealed class AnnouncementEntity : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime? ExpiresAtUtc { get; set; }
    public string Audience { get; set; } = Audiences.Everyone;

    public int CreatedByUserId { get; set; }
    public UniStayUserEntity? CreatedByUser { get; set; }

    public static class Audiences
    {
        public const string Everyone = "Everyone";
        public const string Students = "Students";
        public const string Employees = "Employees";
        public const string StudentsAndEmployees = "StudentsAndEmployees";

        public static readonly string[] All =
        [
            Everyone,
            Students,
            Employees,
            StudentsAndEmployees
        ];
    }

    public static class Constraints
    {
        public const int TitleMaxLength = 200;
        public const int ContentMaxLength = 4000;
        public const int AudienceMaxLength = 50;
    }
}
