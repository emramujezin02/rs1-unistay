namespace UniStay.Application.Modules.Account.Password.Commands.SendResetToken;

public sealed class SendPasswordResetTokenCommandValidator : AbstractValidator<SendPasswordResetTokenCommand>
{
    public SendPasswordResetTokenCommandValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
    }
}
