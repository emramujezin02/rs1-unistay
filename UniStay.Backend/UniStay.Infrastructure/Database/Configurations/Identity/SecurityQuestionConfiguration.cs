namespace UniStay.Infrastructure.Database.Configurations.Identity;

public sealed class SecurityQuestionConfiguration : IEntityTypeConfiguration<SecurityQuestionEntity>
{
    public void Configure(EntityTypeBuilder<SecurityQuestionEntity> builder)
    {
        builder.ToTable("SecurityQuestions");
        builder.Property(x => x.Text).IsRequired().HasMaxLength(SecurityQuestionEntity.Constraints.TextMaxLength);
    }
}
