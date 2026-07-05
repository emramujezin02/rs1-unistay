namespace UniStay.Application.Modules.Account.Users.Commands.Create;

public sealed class CreateUserCommand : IRequest<int>
{
    public required string Email { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public string Phone { get; set; } = string.Empty;
    public DateTime? DateOfBirth { get; set; }
    public string? Username { get; set; }
    public required string Password { get; set; }
    public string? ProfileImage { get; set; }
    public int? RoleId { get; set; }
}
