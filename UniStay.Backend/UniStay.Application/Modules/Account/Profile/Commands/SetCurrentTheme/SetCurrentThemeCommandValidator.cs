namespace UniStay.Application.Modules.Account.Profile.Commands.SetCurrentTheme;

public sealed class SetCurrentThemeCommandValidator : AbstractValidator<SetCurrentThemeCommand>
{
    public SetCurrentThemeCommandValidator()
    {
        RuleFor(x => x.Theme)
            .NotEmpty()
            .Must(theme => string.Equals(theme, "light", StringComparison.OrdinalIgnoreCase) ||
                           string.Equals(theme, "dark", StringComparison.OrdinalIgnoreCase))
            .WithMessage("Theme must be one of: light, dark.");
    }
}
