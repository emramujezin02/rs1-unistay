using UniStay.Domain.Entities.Webhooks;

namespace UniStay.Application.Modules.Webhooks.Commands.CreateWebhookSubscription;

public sealed class CreateWebhookSubscriptionCommandValidator : AbstractValidator<CreateWebhookSubscriptionCommand>
{
    public CreateWebhookSubscriptionCommandValidator()
    {
        RuleFor(x => x.Url)
            .NotEmpty().WithMessage("Url is required.")
            .MaximumLength(WebhookSubscriptionEntity.Constraints.UrlMaxLength)
            .Must(x => Uri.TryCreate(x, UriKind.Absolute, out var uri)
                && (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps))
            .WithMessage("Url must be a valid absolute HTTP or HTTPS URL.");

        RuleFor(x => x.Secret)
            .NotEmpty().WithMessage("Secret is required.")
            .MaximumLength(WebhookSubscriptionEntity.Constraints.SecretMaxLength);

        RuleFor(x => x.Events)
            .NotEmpty().WithMessage("At least one event is required.");

        RuleForEach(x => x.Events)
            .NotEmpty().WithMessage("Event name must not be empty.");

        RuleFor(x => string.Join(",", x.Events))
            .MaximumLength(WebhookSubscriptionEntity.Constraints.EventsMaxLength)
            .WithMessage("Events cannot exceed 1024 characters.");

        RuleFor(x => x.Description)
            .MaximumLength(WebhookSubscriptionEntity.Constraints.DescriptionMaxLength);
    }
}
