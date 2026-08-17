using UniStay.Domain.Entities.Webhooks;

namespace UniStay.Infrastructure.Database.Configurations.Webhooks;

public sealed class WebhookSubscriptionConfiguration : IEntityTypeConfiguration<WebhookSubscriptionEntity>
{
    public void Configure(EntityTypeBuilder<WebhookSubscriptionEntity> builder)
    {
        builder.ToTable("WebhookSubscriptions");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Url)
            .IsRequired()
            .HasMaxLength(WebhookSubscriptionEntity.Constraints.UrlMaxLength);

        builder.Property(x => x.Secret)
            .IsRequired()
            .HasMaxLength(WebhookSubscriptionEntity.Constraints.SecretMaxLength);

        builder.Property(x => x.Events)
            .IsRequired()
            .HasMaxLength(WebhookSubscriptionEntity.Constraints.EventsMaxLength);

        builder.Property(x => x.Description)
            .HasMaxLength(WebhookSubscriptionEntity.Constraints.DescriptionMaxLength);

        builder.Property(x => x.IsActive)
            .IsRequired()
            .HasDefaultValue(true);
    }
}
