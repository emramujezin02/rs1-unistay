namespace UniStay.Application.Modules.Account.Users.Queries.CheckUsernameAvailability;

public sealed class CheckUsernameAvailabilityQueryValidator : AbstractValidator<CheckUsernameAvailabilityQuery>
{
    public CheckUsernameAvailabilityQueryValidator()
    {
        RuleFor(x => x.Username)
            .NotEmpty().WithMessage("Username is required.")
            .MaximumLength(UniStayUserEntity.Constraints.UsernameMaxLength)
            .WithMessage($"Username can be up to {UniStayUserEntity.Constraints.UsernameMaxLength} characters long.");
    }
}
