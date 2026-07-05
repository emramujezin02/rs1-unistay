using UniStay.Application.Modules.Account.Profile.Common;

namespace UniStay.Application.Modules.Account.Profile.Queries.GetCurrentProfile;

public sealed record GetCurrentProfileQuery : IRequest<ProfileDto>;
