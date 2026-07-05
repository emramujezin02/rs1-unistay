namespace UniStay.Application.Modules.Housing.Rooms.Commands.Update;

public sealed class UpdateRoomCommandHandler(
    IAppDbContext context,
    IAppCurrentUser currentUser)
    : IRequestHandler<UpdateRoomCommand, Unit>
{
    public async Task<Unit> Handle(UpdateRoomCommand request, CancellationToken ct)
    {
        if (!currentUser.IsAdmin)
            throw new UnauthorizedAccessException("Only admins can update rooms.");

        var room = await context.Rooms
            .Include(x => x.Beds)
            .ThenInclude(x => x.Assignments)
            .Include(x => x.Images)
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct)
            ?? throw new UniStayNotFoundException("Room not found.");

        if (!string.IsNullOrWhiteSpace(request.RoomNumber))
        {
            var roomNumber = request.RoomNumber.Trim();
            var exists = await context.Rooms
                .AnyAsync(x => x.Id != request.Id && x.RoomNumber.ToLower() == roomNumber.ToLower(), ct);

            if (exists)
                throw new UniStayConflictException("A room with this number already exists.");

            room.RoomNumber = roomNumber;
        }

        if (request.Floor.HasValue)
            room.Floor = request.Floor.Value;

        if (request.Description is not null)
            room.Description = request.Description.Trim();

        if (request.Building is not null)
            room.Building = string.IsNullOrWhiteSpace(request.Building) ? null : request.Building.Trim();

        if (request.RoomSide is not null)
            room.RoomSide = string.IsNullOrWhiteSpace(request.RoomSide) ? null : request.RoomSide.Trim();

        if (request.NearExit.HasValue)
            room.NearExit = request.NearExit.Value;

        if (request.WheelchairAccessible.HasValue)
            room.WheelchairAccessible = request.WheelchairAccessible.Value;

        if (request.ElevatorAccess.HasValue)
            room.ElevatorAccess = request.ElevatorAccess.Value;

        if (request.HallId.HasValue)
        {
            var hallExists = await context.Halls.AnyAsync(x => x.Id == request.HallId.Value, ct);
            if (!hallExists)
                throw new UniStayNotFoundException("Hall not found.");

            room.HallId = request.HallId.Value;
        }

        if (request.MaxOccupancy.HasValue && request.MaxOccupancy.Value != room.MaxOccupancy)
            UpdateOccupancy(room, request.MaxOccupancy.Value);

        if (request.Images is not null)
        {
            context.RoomImages.RemoveRange(room.Images);
            foreach (var image in request.Images.Where(x => !string.IsNullOrWhiteSpace(x)).Distinct())
                room.Images.Add(new RoomImageEntity { ImageUrl = image.Trim().TrimStart('/') });
        }

        await context.SaveChangesAsync(ct);
        return Unit.Value;
    }

    private static void UpdateOccupancy(RoomEntity room, int maxOccupancy)
    {
        if (maxOccupancy < room.Beds.Count(x => x.Assignments.Any()))
            throw new UniStayConflictException("Cannot reduce occupancy below assigned bed count.");

        if (maxOccupancy > room.MaxOccupancy)
        {
            for (var i = room.Beds.Count + 1; i <= maxOccupancy; i++)
                room.Beds.Add(new BedEntity { BedNumber = $"{room.RoomNumber}-{i}" });
        }
        else
        {
            var removableBeds = room.Beds
                .Where(x => !x.Assignments.Any())
                .OrderByDescending(x => x.Id)
                .Take(room.Beds.Count - maxOccupancy)
                .ToList();

            if (removableBeds.Count != room.Beds.Count - maxOccupancy)
                throw new UniStayConflictException("Cannot reduce occupancy because some beds are assigned.");

            foreach (var bed in removableBeds)
                room.Beds.Remove(bed);
        }

        room.MaxOccupancy = maxOccupancy;
    }
}
