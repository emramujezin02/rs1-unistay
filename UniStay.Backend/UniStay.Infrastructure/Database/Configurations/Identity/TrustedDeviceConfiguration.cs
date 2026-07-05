namespace UniStay.Infrastructure.Database.Configurations.Identity;

public sealed class TrustedDeviceConfiguration : IEntityTypeConfiguration<TrustedDeviceEntity>
{
    public void Configure(EntityTypeBuilder<TrustedDeviceEntity> builder)
    {
        builder.ToTable("TrustedDevices");
        builder.Property(x => x.TokenHash).IsRequired();
        builder.HasIndex(x => x.TokenHash);
        builder.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
    }
}
