using UniStay.Application.Modules.Account.Profile.Common;

namespace UniStay.Application.Modules.Account.Profile.Queries.GetCurrentProfile;

public sealed class GetCurrentProfileQueryHandler(IAppDbContext context, IAppCurrentUser currentUser)
    : IRequestHandler<GetCurrentProfileQuery, ProfileDto>
{
    public async Task<ProfileDto> Handle(GetCurrentProfileQuery request, CancellationToken ct)
    {
        var userId = currentUser.UserId
            ?? throw new UnauthorizedAccessException("User must be authenticated.");

        var user = await context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == userId && !x.IsDeleted, ct)
            ?? throw new UniStayNotFoundException("Current user was not found.");

        return ProfileDto.FromUser(user);
    }
}
