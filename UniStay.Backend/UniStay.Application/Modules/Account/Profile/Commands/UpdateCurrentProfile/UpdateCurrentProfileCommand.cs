using UniStay.Application.Modules.Account.Profile.Common;

namespace UniStay.Application.Modules.Account.Profile.Commands.UpdateCurrentProfile;

public sealed class UpdateCurrentProfileCommand : IRequest<ProfileDto>
{
    public string? Email { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Phone { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? Username { get; set; }
    public string? ProfileImage { get; set; }
    public string? Theme { get; set; }
}
