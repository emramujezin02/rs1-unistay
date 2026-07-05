namespace UniStay.Application.Modules.AccommodationApplications.Queries.GetApplicationById;

public sealed class GetApplicationByIdQueryHandler(
    IAppDbContext context,
    IAppCurrentUser currentUser)
    : IRequestHandler<GetApplicationByIdQuery, GetApplicationByIdResult>
{
    public async Task<GetApplicationByIdResult> Handle(GetApplicationByIdQuery request, CancellationToken ct)
    {
        var application = await context.AccommodationApplications
            .AsNoTracking()
            .Include(x => x.Student)
            .Include(x => x.AssignedRoom)
            .FirstOrDefaultAsync(x => x.Id == request.ApplicationId, ct)
            ?? throw new UniStayNotFoundException($"Application {request.ApplicationId} not found.");

        var callerId = currentUser.UserId
            ?? throw new UnauthorizedAccessException("You must be logged in.");

        if (!currentUser.IsAdmin && application.StudentId != callerId)
            throw new UnauthorizedAccessException("You are not authorised to view this application.");

        return new GetApplicationByIdResult(
            application.Id,
            application.StudentId,
            application.Student?.Username ?? string.Empty,
            application.Student?.Email ?? string.Empty,
            application.Student?.Firstname ?? string.Empty,
            application.Student?.Lastname ?? string.Empty,
            application.PreferredRoomType,
            application.Notes,
            application.Status.ToString(),
            application.AppliedAtUtc,
            application.DecisionAtUtc,
            application.AssignedRoomId,
            application.AssignedRoom?.RoomNumber,
            application.DecisionByUserId);
    }
}
