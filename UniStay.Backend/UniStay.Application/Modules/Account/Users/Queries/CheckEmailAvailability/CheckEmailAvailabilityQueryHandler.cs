namespace UniStay.Application.Modules.Account.Users.Queries.CheckEmailAvailability;

public sealed class CheckEmailAvailabilityQueryHandler(IAppDbContext context)
    : IRequestHandler<CheckEmailAvailabilityQuery, CheckEmailAvailabilityResult>
{
    public async Task<CheckEmailAvailabilityResult> Handle(
        CheckEmailAvailabilityQuery request,
        CancellationToken ct)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        var taken = await context.Users
            .AsNoTracking()
            .AnyAsync(x => x.Email.ToLower() == email, ct);

        return new CheckEmailAvailabilityResult(!taken);
    }
}
