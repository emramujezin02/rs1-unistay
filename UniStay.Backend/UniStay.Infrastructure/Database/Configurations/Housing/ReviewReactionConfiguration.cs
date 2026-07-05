namespace UniStay.Infrastructure.Database.Configurations.Housing;

public sealed class ReviewReactionConfiguration : IEntityTypeConfiguration<ReviewReactionEntity>
{
    public void Configure(EntityTypeBuilder<ReviewReactionEntity> builder)
    {
        builder.ToTable("ReviewReactions");

        builder.HasKey(x => x.Id);

        builder.HasIndex(x => new { x.RoomReviewId, x.UserId })
            .IsUnique();

        builder.Property(x => x.IsLike)
            .IsRequired();

        builder.HasOne(x => x.Review)
            .WithMany(x => x.Reactions)
            .HasForeignKey(x => x.RoomReviewId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
