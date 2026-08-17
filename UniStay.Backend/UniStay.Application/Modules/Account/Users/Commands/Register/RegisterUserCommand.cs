namespace UniStay.Application.Modules.Account.Users.Commands.Register;

/// <summary>
/// Public self-registration command. The Student role is assigned automatically.
/// </summary>
public sealed record RegisterUserCommand(
    string Username,
    string Email,
    string Password,
    string FirstName,
    string LastName,
    string? InviteToken = null) : IRequest<RegisterUserResult>;
