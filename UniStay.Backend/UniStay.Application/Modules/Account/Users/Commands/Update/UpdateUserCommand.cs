namespace UniStay.Application.Modules.Account.Users.Commands.Update;

public sealed class UpdateUserCommand : IRequest<Unit>
{
    [JsonIgnore]
    public int Id { get; set; }

    public string? Email { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Phone { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? Username { get; set; }
    public string? Password { get; set; }
    public string? ProfileImage { get; set; }
    public int? RoleId { get; set; }
    public bool? IsEnabled { get; set; }
}
