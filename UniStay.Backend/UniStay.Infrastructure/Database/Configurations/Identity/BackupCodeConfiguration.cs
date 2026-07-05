namespace UniStay.Infrastructure.Database.Configurations.Identity;

public sealed class BackupCodeConfiguration : IEntityTypeConfiguration<BackupCodeEntity>
{
    public void Configure(EntityTypeBuilder<BackupCodeEntity> builder)
    {
        builder.ToTable("BackupCodes");
        builder.Property(x => x.CodeHash).IsRequired();
        builder.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
    }
}
