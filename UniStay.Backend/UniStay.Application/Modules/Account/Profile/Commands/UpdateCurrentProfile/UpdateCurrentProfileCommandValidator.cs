namespace UniStay.Application.Modules.Account.Profile.Commands.UpdateCurrentProfile;

public sealed class UpdateCurrentProfileCommandValidator : AbstractValidator<UpdateCurrentProfileCommand>
{
    public UpdateCurrentProfileCommandValidator()
    {
        RuleFor(x => x.Email)
            .EmailAddress().WithMessage("Invalid email format.")
            .MaximumLength(UniStayUserEntity.Constraints.EmailMaxLength)
            .When(x => !string.IsNullOrWhiteSpace(x.Email));

        RuleFor(x => x.FirstName)
            .MinimumLength(2)
            .MaximumLength(UniStayUserEntity.Constraints.FirstNameMaxLength)
            .When(x => !string.IsNullOrWhiteSpace(x.FirstName));

        RuleFor(x => x.LastName)
            .MinimumLength(2)
            .MaximumLength(UniStayUserEntity.Constraints.LastNameMaxLength)
            .When(x => !string.IsNullOrWhiteSpace(x.LastName));

        RuleFor(x => x.Phone)
            .Matches(@"^\d{6,15}$")
            .When(x => !string.IsNullOrWhiteSpace(x.Phone))
            .WithMessage("Phone must be digits only (6-15 digits).");

        RuleFor(x => x.DateOfBirth)
            .LessThan(DateTime.UtcNow)
            .When(x => x.DateOfBirth.HasValue)
            .WithMessage("Date of birth cannot be in the future.");

        RuleFor(x => x.Username)
            .MinimumLength(3)
            .MaximumLength(UniStayUserEntity.Constraints.UsernameMaxLength)
            .When(x => !string.IsNullOrWhiteSpace(x.Username));

        RuleFor(x => x.ProfileImage)
            .MaximumLength(UniStayUserEntity.Constraints.ProfileImageMaxLength);

        RuleFor(x => x.Theme)
            .Must(theme => string.Equals(theme, "light", StringComparison.OrdinalIgnoreCase) ||
                           string.Equals(theme, "dark", StringComparison.OrdinalIgnoreCase))
            .When(x => !string.IsNullOrWhiteSpace(x.Theme))
            .WithMessage("Theme must be one of: light, dark.");
    }
}
