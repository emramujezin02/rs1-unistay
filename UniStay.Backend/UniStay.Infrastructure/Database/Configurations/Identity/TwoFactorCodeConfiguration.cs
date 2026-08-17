namespace UniStay.Infrastructure.Database.Configurations.Identity;

public sealed class TwoFactorCodeConfiguration : IEntityTypeConfiguration<TwoFactorCodeEntity>
{
    public void Configure(EntityTypeBuilder<TwoFactorCodeEntity> builder)
    {
        builder.ToTable("TwoFactorCodes");
        builder.Property(x => x.CodeHash).IsRequired();
        builder.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
    }
}
