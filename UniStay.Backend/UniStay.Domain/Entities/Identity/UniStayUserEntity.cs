using UniStay.Domain.Common;

namespace UniStay.Domain.Entities.Identity;

public sealed class UniStayUserEntity : BaseEntity
{
    public static class Constraints
    {
        public const int FirstNameMaxLength = 100;
        public const int LastNameMaxLength = 100;
        public const int EmailMaxLength = 200;
        public const int PhoneMaxLength = 30;
        public const int UsernameMaxLength = 100;
        public const int ProfileImageMaxLength = 500;
        public const int ThemeMaxLength = 30;
        public const int FcmTokenMaxLength = 512;
    }

    public string Firstname { get; set; } = string.Empty;
    public string Lastname { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public DateTime? DateOfBirth { get; set; }
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string ProfileImage { get; set; } = string.Empty;
    public string Theme { get; set; } = "light";
    public string? FcmToken { get; set; }
    public bool RememberMe { get; set; }
    public bool IsAdmin { get; set; }
    public bool IsManager { get; set; }
    public bool IsStudent { get; set; }
    public bool IsEmployee { get; set; }
    public int TokenVersion { get; set; } = 0;
    public bool IsEnabled { get; set; }
    public ICollection<RefreshTokenEntity> RefreshTokens { get; private set; } = new List<RefreshTokenEntity>();
    public ICollection<UniStay.Domain.Entities.Communication.MessageEntity> SentMessages { get; private set; } = new List<UniStay.Domain.Entities.Communication.MessageEntity>();
    public ICollection<UniStay.Domain.Entities.Communication.MessageEntity> ReceivedMessages { get; private set; } = new List<UniStay.Domain.Entities.Communication.MessageEntity>();
    public ICollection<UniStay.Domain.Entities.Reservations.HallReservationEntity> HallReservations { get; private set; } = new List<UniStay.Domain.Entities.Reservations.HallReservationEntity>();
}
