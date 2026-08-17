namespace UniStay.Infrastructure.Database.Configurations.Communication;

public sealed class AnnouncementConfiguration : IEntityTypeConfiguration<AnnouncementEntity>
{
    public void Configure(EntityTypeBuilder<AnnouncementEntity> builder)
    {
        builder.ToTable("Announcements");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Title)
            .IsRequired()
            .HasMaxLength(AnnouncementEntity.Constraints.TitleMaxLength);

        builder.Property(x => x.Content)
            .IsRequired()
            .HasMaxLength(AnnouncementEntity.Constraints.ContentMaxLength);

        builder.Property(x => x.ExpiresAtUtc)
            .IsRequired(false);

        builder.Property(x => x.Audience)
            .IsRequired()
            .HasMaxLength(AnnouncementEntity.Constraints.AudienceMaxLength)
            .HasDefaultValue(AnnouncementEntity.Audiences.Everyone);

        builder.HasOne(x => x.CreatedByUser)
            .WithMany()
            .HasForeignKey(x => x.CreatedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(x => new { x.Audience, x.ExpiresAtUtc });
        builder.HasIndex(x => x.CreatedAtUtc);
    }
}
