namespace UniStay.Infrastructure.Database.Configurations.Housing;

public sealed class RoomReviewConfiguration : IEntityTypeConfiguration<RoomReviewEntity>
{
    public void Configure(EntityTypeBuilder<RoomReviewEntity> builder)
    {
        builder.ToTable("RoomReviews");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Rating)
            .IsRequired();

        builder.Property(x => x.Comment)
            .HasMaxLength(RoomReviewEntity.Constraints.CommentMaxLength)
            .IsRequired();

        builder.HasOne(x => x.Room)
            .WithMany(x => x.Reviews)
            .HasForeignKey(x => x.RoomId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(x => x.Reactions)
            .WithOne(x => x.Review)
            .HasForeignKey(x => x.RoomReviewId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
