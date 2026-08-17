namespace UniStay.Application.Modules.Announcements.Commands.CreateAnnouncement;

public sealed class CreateAnnouncementCommandValidator : AbstractValidator<CreateAnnouncementCommand>
{
    public CreateAnnouncementCommandValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(AnnouncementEntity.Constraints.TitleMaxLength)
            .WithMessage($"Title must not exceed {AnnouncementEntity.Constraints.TitleMaxLength} characters.");

        RuleFor(x => x.Content)
            .NotEmpty().WithMessage("Content is required.")
            .MaximumLength(AnnouncementEntity.Constraints.ContentMaxLength)
            .WithMessage($"Content must not exceed {AnnouncementEntity.Constraints.ContentMaxLength} characters.");

        RuleFor(x => x.ExpiresAtUtc)
            .Must(x => x is null || x > DateTime.UtcNow)
            .WithMessage("ExpiresAtUtc must be a future UTC date.");

        RuleFor(x => x.Audience)
            .NotEmpty().WithMessage("Audience is required.")
            .Must(x => AnnouncementEntity.Audiences.All.Contains(x))
            .WithMessage($"Audience must be one of: {string.Join(", ", AnnouncementEntity.Audiences.All)}.");
    }
}
