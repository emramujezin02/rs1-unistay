namespace UniStay.Infrastructure.Database.Configurations.Identity;

public sealed class InviteTokenConfiguration : IEntityTypeConfiguration<InviteTokenEntity>
{
    public void Configure(EntityTypeBuilder<InviteTokenEntity> builder)
    {
        builder.ToTable("InviteTokens");

        builder.Property(x => x.Email)
            .IsRequired()
            .HasMaxLength(InviteTokenEntity.EmailMaxLength);

        builder.Property(x => x.TokenHash)
            .IsRequired();

        builder.HasIndex(x => x.TokenHash).IsUnique();
        builder.HasIndex(x => x.Email);
    }
}
