namespace UniStay.Application.Modules.Account.Users.Queries.CheckUsernameAvailability;

public sealed class CheckUsernameAvailabilityQueryHandler(IAppDbContext context)
    : IRequestHandler<CheckUsernameAvailabilityQuery, CheckUsernameAvailabilityResult>
{
    public async Task<CheckUsernameAvailabilityResult> Handle(
        CheckUsernameAvailabilityQuery request,
        CancellationToken ct)
    {
        var username = request.Username.Trim().ToLowerInvariant();

        var taken = await context.Users
            .AsNoTracking()
            .AnyAsync(x => x.Username.ToLower() == username, ct);

        return new CheckUsernameAvailabilityResult(!taken);
    }
}
