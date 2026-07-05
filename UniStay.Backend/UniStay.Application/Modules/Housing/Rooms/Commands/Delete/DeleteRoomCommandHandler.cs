namespace UniStay.Application.Modules.Housing.Rooms.Commands.Delete;

public sealed class DeleteRoomCommandHandler(
    IAppDbContext context,
    IAppCurrentUser currentUser)
    : IRequestHandler<DeleteRoomCommand, Unit>
{
    public async Task<Unit> Handle(DeleteRoomCommand request, CancellationToken ct)
    {
        if (!currentUser.IsAdmin)
            throw new UnauthorizedAccessException("Only admins can delete rooms.");

        var room = await context.Rooms
            .Include(x => x.Beds)
            .ThenInclude(x => x.Assignments)
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct)
            ?? throw new UniStayNotFoundException("Room not found.");

        if (room.Beds.Any(x => x.Assignments.Any()))
            throw new UniStayConflictException("Cannot delete room because students are assigned to beds.");

        context.Rooms.Remove(room);
        await context.SaveChangesAsync(ct);

        return Unit.Value;
    }
}
