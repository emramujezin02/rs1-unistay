using UniStay.Application.Modules.Account.Profile.Common;

namespace UniStay.Application.Modules.Account.Profile.Commands.UpdateCurrentProfile;

public sealed class UpdateCurrentProfileCommandHandler(IAppDbContext context, IAppCurrentUser currentUser)
    : IRequestHandler<UpdateCurrentProfileCommand, ProfileDto>
{
    public async Task<ProfileDto> Handle(UpdateCurrentProfileCommand request, CancellationToken ct)
    {
        var userId = currentUser.UserId
            ?? throw new UnauthorizedAccessException("User must be authenticated.");

        var user = await context.Users
            .FirstOrDefaultAsync(x => x.Id == userId && !x.IsDeleted, ct)
            ?? throw new UniStayNotFoundException("Current user was not found.");

        if (!string.IsNullOrWhiteSpace(request.Email))
        {
            var email = request.Email.Trim().ToLowerInvariant();
            var emailExists = await context.Users
                .AnyAsync(x => x.Id != user.Id && x.Email.ToLower() == email, ct);

            if (emailExists)
                throw new UniStayConflictException("Email is already in use.");

            user.Email = email;
        }

        if (!string.IsNullOrWhiteSpace(request.Username))
        {
            var username = request.Username.Trim();
            var normalizedUsername = username.ToLowerInvariant();
            var usernameExists = await context.Users
                .AnyAsync(x => x.Id != user.Id && x.Username.ToLower() == normalizedUsername, ct);

            if (usernameExists)
                throw new UniStayConflictException("Username is already in use.");

            user.Username = username;
        }

        if (!string.IsNullOrWhiteSpace(request.Phone))
        {
            var phone = request.Phone.Trim();
            var phoneExists = await context.Users
                .AnyAsync(x => x.Id != user.Id && x.Phone == phone, ct);

            if (phoneExists)
                throw new UniStayConflictException("Phone is already in use.");

            user.Phone = phone;
        }
        else if (request.Phone is not null)
        {
            user.Phone = string.Empty;
        }

        if (!string.IsNullOrWhiteSpace(request.FirstName))
            user.Firstname = request.FirstName.Trim();

        if (!string.IsNullOrWhiteSpace(request.LastName))
            user.Lastname = request.LastName.Trim();

        if (request.DateOfBirth.HasValue)
            user.DateOfBirth = request.DateOfBirth.Value;

        if (request.ProfileImage is not null)
            user.ProfileImage = request.ProfileImage.Trim();

        if (!string.IsNullOrWhiteSpace(request.Theme))
            user.Theme = request.Theme.Trim().ToLowerInvariant();

        await context.SaveChangesAsync(ct);

        return ProfileDto.FromUser(user);
    }
}
