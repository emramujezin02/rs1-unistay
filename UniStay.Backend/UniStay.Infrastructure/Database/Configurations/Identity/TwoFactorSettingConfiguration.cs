namespace UniStay.Infrastructure.Database.Configurations.Identity;

public sealed class TwoFactorSettingConfiguration : IEntityTypeConfiguration<TwoFactorSettingEntity>
{
    public void Configure(EntityTypeBuilder<TwoFactorSettingEntity> builder)
    {
        builder.ToTable("TwoFactorSettings");
        builder.HasIndex(x => x.UserId).IsUnique();
        builder.Property(x => x.Method).IsRequired().HasMaxLength(50);
        builder.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
    }
}
