using UniStay.Application.Modules.Account.Users.Common;

namespace UniStay.Application.Modules.Account.Users.Commands.Update;

public sealed class UpdateUserCommandValidator : AbstractValidator<UpdateUserCommand>
{
    public UpdateUserCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0);

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

        RuleFor(x => x.Password)
            .MinimumLength(6)
            .When(x => !string.IsNullOrWhiteSpace(x.Password));

        RuleFor(x => x.ProfileImage)
            .MaximumLength(UniStayUserEntity.Constraints.ProfileImageMaxLength);

        RuleFor(x => x.RoleId)
            .Must(roleId => roleId is null || UserRoleMapper.IsSupportedRole(roleId.Value))
            .WithMessage("RoleId must be one of: 1 Admin, 2 Student, 3 Employee, 4 Manager.");
    }
}
