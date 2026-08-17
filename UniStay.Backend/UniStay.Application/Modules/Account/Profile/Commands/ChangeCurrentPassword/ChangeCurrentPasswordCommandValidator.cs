namespace UniStay.Application.Modules.Account.Profile.Commands.ChangeCurrentPassword;

public sealed class ChangeCurrentPasswordCommandValidator : AbstractValidator<ChangeCurrentPasswordCommand>
{
    public ChangeCurrentPasswordCommandValidator()
    {
        RuleFor(x => x.CurrentPassword)
            .NotEmpty()
            .WithMessage("Current password is required.");

        RuleFor(x => x.NewPassword)
            .NotEmpty()
            .MinimumLength(6)
            .WithMessage("New password must be at least 6 characters long.");
    }
}
