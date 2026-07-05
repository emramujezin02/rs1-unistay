using UniStay.Domain.Entities.Notifications;

namespace UniStay.Infrastructure.Database.Configurations.Notifications;

public sealed class NotificationConfiguration : IEntityTypeConfiguration<NotificationEntity>
{
    public void Configure(EntityTypeBuilder<NotificationEntity> builder)
    {
        builder.ToTable("Notifications");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.UserId)
            .IsRequired();

        builder.Property(x => x.Title)
            .IsRequired()
            .HasMaxLength(NotificationEntity.Constraints.TitleMaxLength);

        builder.Property(x => x.Message)
            .IsRequired()
            .HasMaxLength(NotificationEntity.Constraints.MessageMaxLength);

        builder.Property(x => x.Type)
            .IsRequired()
            .HasMaxLength(NotificationEntity.Constraints.TypeMaxLength);

        builder.Property(x => x.IsRead)
            .IsRequired();

        builder.HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(x => x.UserId);
        builder.HasIndex(x => new { x.UserId, x.IsRead });
    }
}
