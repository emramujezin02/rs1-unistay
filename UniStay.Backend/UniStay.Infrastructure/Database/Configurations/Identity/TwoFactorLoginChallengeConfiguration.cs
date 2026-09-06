namespace UniStay.Infrastructure.Database.Configurations.Identity;

public sealed class TwoFactorLoginChallengeConfiguration : IEntityTypeConfiguration<TwoFactorLoginChallengeEntity>
{
    public void Configure(EntityTypeBuilder<TwoFactorLoginChallengeEntity> builder)
    {
        builder.ToTable("TwoFactorLoginChallenges");
        builder.Property(x => x.ChallengeHash).IsRequired().HasMaxLength(256);
        builder.HasIndex(x => x.ChallengeHash).IsUnique();
        builder.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
    }
}
