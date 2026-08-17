namespace UniStay.Application.Modules.Notifications.Commands.SaveFcmToken;

public sealed class SaveFcmTokenCommandValidator : AbstractValidator<SaveFcmTokenCommand>
{
    public SaveFcmTokenCommandValidator()
    {
        RuleFor(x => x.Token)
            .NotEmpty().WithMessage("FCM token is required.")
            .MaximumLength(UniStayUserEntity.Constraints.FcmTokenMaxLength);
    }
}
