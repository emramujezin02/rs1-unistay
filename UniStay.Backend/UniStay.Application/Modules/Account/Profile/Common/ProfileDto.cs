using UniStay.Application.Modules.Account.Users.Common;

namespace UniStay.Application.Modules.Account.Profile.Common;

public sealed class ProfileDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public DateTime? DateOfBirth { get; set; }
    public string ProfileImage { get; set; } = string.Empty;
    public string Theme { get; set; } = "light";
    public int? RoleId { get; set; }
    public string RoleName { get; set; } = string.Empty;
    public bool IsEnabled { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public static ProfileDto FromUser(UniStayUserEntity user)
    {
        return new ProfileDto
        {
            Id = user.Id,
            UserId = user.Id,
            Email = user.Email,
            FirstName = user.Firstname,
            LastName = user.Lastname,
            Username = user.Username,
            Phone = user.Phone,
            DateOfBirth = user.DateOfBirth,
            ProfileImage = user.ProfileImage,
            Theme = user.Theme,
            RoleId = UserRoleMapper.GetRoleId(user),
            RoleName = UserRoleMapper.GetRoleName(user),
            IsEnabled = user.IsEnabled,
            CreatedAt = user.CreatedAtUtc,
            UpdatedAt = user.ModifiedAtUtc
        };
    }
}
