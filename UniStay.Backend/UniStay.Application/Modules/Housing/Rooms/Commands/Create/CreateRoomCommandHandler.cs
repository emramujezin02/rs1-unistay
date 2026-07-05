namespace UniStay.Application.Modules.Housing.Rooms.Commands.Create;

public sealed class CreateRoomCommandHandler(
    IAppDbContext context,
    IAppCurrentUser currentUser)
    : IRequestHandler<CreateRoomCommand, int>
{
    public async Task<int> Handle(CreateRoomCommand request, CancellationToken ct)
    {
        if (!currentUser.IsAdmin)
            throw new UnauthorizedAccessException("Only admins can create rooms.");

        var roomNumber = request.RoomNumber.Trim();

        var exists = await context.Rooms
            .AnyAsync(x => x.RoomNumber.ToLower() == roomNumber.ToLower(), ct);

        if (exists)
            throw new UniStayConflictException("A room with this number already exists.");

        if (request.HallId.HasValue)
        {
            var hallExists = await context.Halls.AnyAsync(x => x.Id == request.HallId.Value, ct);
            if (!hallExists)
                throw new UniStayNotFoundException("Hall not found.");
        }

        var room = new RoomEntity
        {
            RoomNumber = roomNumber,
            Floor = request.Floor,
            MaxOccupancy = request.MaxOccupancy,
            Description = request.Description.Trim(),
            Building = string.IsNullOrWhiteSpace(request.Building) ? null : request.Building.Trim(),
            RoomSide = string.IsNullOrWhiteSpace(request.RoomSide) ? null : request.RoomSide.Trim(),
            NearExit = request.NearExit,
            WheelchairAccessible = request.WheelchairAccessible,
            ElevatorAccess = request.ElevatorAccess,
            HallId = request.HallId
        };

        for (var i = 1; i <= request.MaxOccupancy; i++)
        {
            room.Beds.Add(new BedEntity
            {
                BedNumber = $"{roomNumber}-{i}"
            });
        }

        foreach (var image in request.Images.Where(x => !string.IsNullOrWhiteSpace(x)).Distinct())
        {
            room.Images.Add(new RoomImageEntity { ImageUrl = image.Trim().TrimStart('/') });
        }

        context.Rooms.Add(room);
        await context.SaveChangesAsync(ct);

        return room.Id;
    }
}
