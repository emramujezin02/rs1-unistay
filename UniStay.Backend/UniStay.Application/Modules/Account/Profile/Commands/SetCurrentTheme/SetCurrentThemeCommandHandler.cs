namespace UniStay.Application.Modules.Account.Profile.Commands.SetCurrentTheme;

public sealed class SetCurrentThemeCommandHandler(IAppDbContext context, IAppCurrentUser currentUser)
    : IRequestHandler<SetCurrentThemeCommand, SetCurrentThemeResult>
{
    public async Task<SetCurrentThemeResult> Handle(SetCurrentThemeCommand request, CancellationToken ct)
    {
        var userId = currentUser.UserId
            ?? throw new UnauthorizedAccessException("User must be authenticated.");

        var user = await context.Users
            .FirstOrDefaultAsync(x => x.Id == userId && !x.IsDeleted, ct)
            ?? throw new UniStayNotFoundException("Current user was not found.");

        user.Theme = request.Theme.Trim().ToLowerInvariant();

        await context.SaveChangesAsync(ct);

        return new SetCurrentThemeResult(user.Id, user.Theme);
    }
}
