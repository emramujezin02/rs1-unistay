namespace UniStay.Infrastructure.Database.Configurations.Identity;

public sealed class UserEntityConfiguration : IEntityTypeConfiguration<UniStayUserEntity>
{
    public void Configure(EntityTypeBuilder<UniStayUserEntity> b)
    {
        b.ToTable("Users");

        b.HasKey(x => x.Id);

        b.HasIndex(x => x.Email)
            .IsUnique();

        b.HasIndex(x => x.Username)
            .IsUnique()
            .HasFilter("[Username] <> ''");

        b.Property(x => x.Firstname)
            .IsRequired()
            .HasMaxLength(UniStayUserEntity.Constraints.FirstNameMaxLength);

        b.Property(x => x.Lastname)
            .IsRequired()
            .HasMaxLength(UniStayUserEntity.Constraints.LastNameMaxLength);

        b.Property(x => x.Email)
            .IsRequired()
            .HasMaxLength(UniStayUserEntity.Constraints.EmailMaxLength);

        b.Property(x => x.Phone)
            .HasMaxLength(UniStayUserEntity.Constraints.PhoneMaxLength);

        b.Property(x => x.Username)
            .IsRequired()
            .HasMaxLength(UniStayUserEntity.Constraints.UsernameMaxLength);

        b.Property(x => x.PasswordHash)
            .IsRequired();

        b.Property(x => x.ProfileImage)
            .HasMaxLength(UniStayUserEntity.Constraints.ProfileImageMaxLength);

        b.Property(x => x.Theme)
            .IsRequired()
            .HasMaxLength(UniStayUserEntity.Constraints.ThemeMaxLength)
            .HasDefaultValue("light");

        b.Property(x => x.FcmToken)
            .HasMaxLength(UniStayUserEntity.Constraints.FcmTokenMaxLength);

        // Roles
        b.Property(x => x.IsAdmin)
            .HasDefaultValue(false);

        b.Property(x => x.IsManager)
            .HasDefaultValue(false);

        b.Property(x => x.IsStudent)
            .HasDefaultValue(false);

        b.Property(x => x.IsEmployee)
            .HasDefaultValue(true); // Default: regular user

        b.Property(x => x.RememberMe)
            .HasDefaultValue(false);

        b.Property(x => x.TokenVersion)
            .HasDefaultValue(0);

        b.Property(x => x.IsEnabled)
            .HasDefaultValue(true);

        // Navigation
        b.HasMany(x => x.RefreshTokens)
            .WithOne(x => x.User)
            .HasForeignKey(x => x.UserId);
    }
}
