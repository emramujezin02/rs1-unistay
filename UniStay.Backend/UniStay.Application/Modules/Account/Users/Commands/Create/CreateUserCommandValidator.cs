using UniStay.Application.Modules.Account.Users.Common;

namespace UniStay.Application.Modules.Account.Users.Commands.Create;

public sealed class CreateUserCommandValidator : AbstractValidator<CreateUserCommand>
{
    public CreateUserCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Invalid email format.")
            .MaximumLength(UniStayUserEntity.Constraints.EmailMaxLength);

        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("First name is required.")
            .MinimumLength(2).WithMessage("First name must have at least 2 characters.")
            .MaximumLength(UniStayUserEntity.Constraints.FirstNameMaxLength);

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Last name is required.")
            .MinimumLength(2).WithMessage("Last name must have at least 2 characters.")
            .MaximumLength(UniStayUserEntity.Constraints.LastNameMaxLength);

        RuleFor(x => x.Phone)
            .Matches(@"^\d{6,15}$")
            .When(x => !string.IsNullOrWhiteSpace(x.Phone))
            .WithMessage("Phone must be digits only (6-15 digits).");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required.")
            .MinimumLength(6).WithMessage("Password must have at least 6 characters.");

        RuleFor(x => x.DateOfBirth)
            .LessThan(DateTime.UtcNow)
            .When(x => x.DateOfBirth.HasValue)
            .WithMessage("Date of birth cannot be in the future.");

        RuleFor(x => x.Username)
            .MinimumLength(3)
            .MaximumLength(UniStayUserEntity.Constraints.UsernameMaxLength)
            .When(x => !string.IsNullOrWhiteSpace(x.Username))
            .WithMessage("Username must have between 3 and 100 characters.");

        RuleFor(x => x.ProfileImage)
            .MaximumLength(UniStayUserEntity.Constraints.ProfileImageMaxLength);

        RuleFor(x => x.RoleId)
            .Must(roleId => roleId is null || UserRoleMapper.IsSupportedRole(roleId.Value))
            .WithMessage("RoleId must be one of: 1 Admin, 2 Student, 3 Employee, 4 Manager.");
    }
}
