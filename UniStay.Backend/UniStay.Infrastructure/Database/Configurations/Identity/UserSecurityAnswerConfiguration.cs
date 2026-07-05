namespace UniStay.Infrastructure.Database.Configurations.Identity;

public sealed class UserSecurityAnswerConfiguration : IEntityTypeConfiguration<UserSecurityAnswerEntity>
{
    public void Configure(EntityTypeBuilder<UserSecurityAnswerEntity> builder)
    {
        builder.ToTable("UserSecurityAnswers");
        builder.Property(x => x.AnswerHash).IsRequired();
        builder.HasIndex(x => new { x.UserId, x.SecurityQuestionId }).IsUnique();
        builder.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(x => x.SecurityQuestion).WithMany(x => x.UserAnswers).HasForeignKey(x => x.SecurityQuestionId).OnDelete(DeleteBehavior.Cascade);
    }
}
