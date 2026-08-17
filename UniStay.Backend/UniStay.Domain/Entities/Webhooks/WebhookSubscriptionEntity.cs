using UniStay.Domain.Common;

namespace UniStay.Domain.Entities.Webhooks;

public sealed class WebhookSubscriptionEntity : BaseEntity
{
    public string Url { get; set; } = string.Empty;
    public string Secret { get; set; } = string.Empty;
    public string Events { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;

    public static class Constraints
    {
        public const int UrlMaxLength = 2048;
        public const int SecretMaxLength = 512;
        public const int EventsMaxLength = 1024;
        public const int DescriptionMaxLength = 256;
    }
}
