using UniStay.Domain.Entities.Applications;

namespace UniStay.Application.Modules.AccommodationApplications.Commands.CreateApplication;

public sealed class CreateApplicationCommandValidator : AbstractValidator<CreateApplicationCommand>
{
    public CreateApplicationCommandValidator()
    {
        RuleFor(x => x.PreferredRoomType)
            .NotEmpty().WithMessage("Preferred room type is required.")
            .MaximumLength(AccommodationApplicationEntity.Constraints.PreferredRoomTypeMaxLength)
            .WithMessage("Preferred room type cannot exceed 100 characters.");

        RuleFor(x => x.YearOfStudy)
            .InclusiveBetween(1, 6).WithMessage("Year of study must be between 1 and 6.");

        RuleFor(x => x.GpaScore)
            .InclusiveBetween(0m, 10m).WithMessage("GPA must be between 0 and 10.")
            .When(x => x.GpaScore.HasValue);

        RuleFor(x => x.PhoneNumber)
            .MaximumLength(AccommodationApplicationEntity.Constraints.PhoneNumberMaxLength)
            .WithMessage("Phone number cannot exceed 30 characters.")
            .When(x => x.PhoneNumber is not null);

        RuleFor(x => x.SpecialRequirements)
            .MaximumLength(AccommodationApplicationEntity.Constraints.SpecialRequirementsMaxLength)
            .WithMessage("Special requirements cannot exceed 1000 characters.")
            .When(x => x.SpecialRequirements is not null);

        RuleFor(x => x.DocumentNames)
            .MaximumLength(AccommodationApplicationEntity.Constraints.DocumentNamesMaxLength)
            .WithMessage("Document names cannot exceed 2000 characters.")
            .When(x => x.DocumentNames is not null);

        RuleFor(x => x.Notes)
            .MaximumLength(AccommodationApplicationEntity.Constraints.NotesMaxLength)
            .WithMessage("Notes cannot exceed 2000 characters.")
            .When(x => x.Notes is not null);
    }
}
