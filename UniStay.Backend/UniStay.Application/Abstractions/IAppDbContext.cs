using UniStay.Domain.Entities.Applications;
using UniStay.Domain.Entities.Housing;
using UniStay.Domain.Entities.Notifications;
using UniStay.Domain.Entities.Payments;
using UniStay.Domain.Entities.Reservations;
using UniStay.Domain.Entities.Webhooks;

namespace UniStay.Application.Abstractions;

// Application layer
public interface IAppDbContext
{
    DbSet<UniStayUserEntity> Users { get; }
    DbSet<RefreshTokenEntity> RefreshTokens { get; }
    DbSet<SecurityQuestionEntity> SecurityQuestions { get; }
    DbSet<UserSecurityAnswerEntity> UserSecurityAnswers { get; }
    DbSet<PasswordResetTokenEntity> PasswordResetTokens { get; }
    DbSet<InviteTokenEntity> InviteTokens { get; }
    DbSet<TwoFactorSettingEntity> TwoFactorSettings { get; }
    DbSet<TwoFactorCodeEntity> TwoFactorCodes { get; }
    DbSet<BackupCodeEntity> BackupCodes { get; }
    DbSet<TrustedDeviceEntity> TrustedDevices { get; }
    DbSet<HallEntity> Halls { get; }
    DbSet<FaultEntity> Faults { get; }
    DbSet<RoomEntity> Rooms { get; }
    DbSet<BedEntity> Beds { get; }
    DbSet<BedAssignmentEntity> BedAssignments { get; }
    DbSet<HallReservationEntity> HallReservations { get; }
    DbSet<RoomImageEntity> RoomImages { get; }
    DbSet<FavoriteRoomEntity> FavoriteRooms { get; }
    DbSet<RoomReviewEntity> RoomReviews { get; }
    DbSet<ReviewReactionEntity> ReviewReactions { get; }
    DbSet<EquipmentEntity> Equipment { get; }
    DbSet<EquipmentItemEntity> EquipmentItems { get; }
    DbSet<AccommodationApplicationEntity> AccommodationApplications { get; }
    DbSet<MessageEntity> Messages { get; }
    DbSet<AnnouncementEntity> Announcements { get; }
    DbSet<NotificationEntity> Notifications { get; }
    DbSet<WebhookSubscriptionEntity> WebhookSubscriptions { get; }
    DbSet<InvoiceEntity> Invoices { get; }
    DbSet<PaymentEntity> Payments { get; }

    Task<int> SaveChangesAsync(CancellationToken ct);
}
