namespace UniStay.Application.Modules.Account.Users.Commands.Register;

public sealed record RegisterUserResult(
    int UserId,
    string Email,
    string Username,
    string FirstName,
    string LastName,
    string Role);
