using UniStay.Application.Abstractions;
using UniStay.Domain.Entities.Applications;
using UniStay.Domain.Entities.Housing;
using UniStay.Domain.Entities.Notifications;
using UniStay.Domain.Entities.Payments;
using UniStay.Domain.Entities.Reservations;
using UniStay.Domain.Entities.Webhooks;

namespace UniStay.Infrastructure.Database;

public partial class DatabaseContext : DbContext, IAppDbContext
{
    public DbSet<RoleEntity> Roles => Set<RoleEntity>();
    public DbSet<UniStayUserEntity> Users => Set<UniStayUserEntity>();
    public DbSet<RefreshTokenEntity> RefreshTokens => Set<RefreshTokenEntity>();
    public DbSet<SecurityQuestionEntity> SecurityQuestions => Set<SecurityQuestionEntity>();
    public DbSet<UserSecurityAnswerEntity> UserSecurityAnswers => Set<UserSecurityAnswerEntity>();
    public DbSet<PasswordResetTokenEntity> PasswordResetTokens => Set<PasswordResetTokenEntity>();
    public DbSet<InviteTokenEntity> InviteTokens => Set<InviteTokenEntity>();
    public DbSet<TwoFactorSettingEntity> TwoFactorSettings => Set<TwoFactorSettingEntity>();
    public DbSet<TwoFactorCodeEntity> TwoFactorCodes => Set<TwoFactorCodeEntity>();
    public DbSet<BackupCodeEntity> BackupCodes => Set<BackupCodeEntity>();
    public DbSet<TrustedDeviceEntity> TrustedDevices => Set<TrustedDeviceEntity>();
    public DbSet<HallEntity> Halls => Set<HallEntity>();
    public DbSet<FaultEntity> Faults => Set<FaultEntity>();
    public DbSet<RoomEntity> Rooms => Set<RoomEntity>();
    public DbSet<BedEntity> Beds => Set<BedEntity>();
    public DbSet<BedAssignmentEntity> BedAssignments => Set<BedAssignmentEntity>();
    public DbSet<HallReservationEntity> HallReservations => Set<HallReservationEntity>();
    public DbSet<RoomImageEntity> RoomImages => Set<RoomImageEntity>();
    public DbSet<FavoriteRoomEntity> FavoriteRooms => Set<FavoriteRoomEntity>();
    public DbSet<RoomReviewEntity> RoomReviews => Set<RoomReviewEntity>();
    public DbSet<ReviewReactionEntity> ReviewReactions => Set<ReviewReactionEntity>();
    public DbSet<EquipmentEntity> Equipment => Set<EquipmentEntity>();
    public DbSet<EquipmentItemEntity> EquipmentItems => Set<EquipmentItemEntity>();
    public DbSet<AccommodationApplicationEntity> AccommodationApplications => Set<AccommodationApplicationEntity>();
    public DbSet<MessageEntity> Messages => Set<MessageEntity>();
    public DbSet<AnnouncementEntity> Announcements => Set<AnnouncementEntity>();
    public DbSet<NotificationEntity> Notifications => Set<NotificationEntity>();
    public DbSet<WebhookSubscriptionEntity> WebhookSubscriptions => Set<WebhookSubscriptionEntity>();
    public DbSet<InvoiceEntity> Invoices => Set<InvoiceEntity>();
    public DbSet<PaymentEntity> Payments => Set<PaymentEntity>();

    private readonly TimeProvider _clock;
    public DatabaseContext(DbContextOptions<DatabaseContext> options, TimeProvider clock) : base(options)
    {
        _clock = clock;
    }
}
