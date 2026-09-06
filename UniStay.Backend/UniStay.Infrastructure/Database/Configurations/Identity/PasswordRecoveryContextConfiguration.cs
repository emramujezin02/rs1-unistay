namespace UniStay.Infrastructure.Database.Configurations.Identity;

public sealed class PasswordRecoveryContextConfiguration : IEntityTypeConfiguration<PasswordRecoveryContextEntity>
{
    public void Configure(EntityTypeBuilder<PasswordRecoveryContextEntity> builder)
    {
        builder.ToTable("PasswordRecoveryContexts");
        builder.Property(x => x.ContextHash).IsRequired().HasMaxLength(256);
        builder.HasIndex(x => x.ContextHash).IsUnique();
        builder.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
    }
}
