using UniStay.Application.Modules.Housing.Rooms.Common;

namespace UniStay.Application.Modules.Housing.Rooms.Queries.GetById;

public sealed class GetRoomByIdQueryHandler(IAppDbContext context)
    : IRequestHandler<GetRoomByIdQuery, GetRoomByIdQueryDto>
{
    public async Task<GetRoomByIdQueryDto> Handle(GetRoomByIdQuery request, CancellationToken ct)
    {
        var room = await context.Rooms
            .AsNoTracking()
            .Include(x => x.Images)
            .Include(x => x.Beds)
            .ThenInclude(x => x.Assignments)
            .ThenInclude(x => x.Student)
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct)
            ?? throw new UniStayNotFoundException("Room not found.");

        return new GetRoomByIdQueryDto
        {
            Id = room.Id,
            RoomNumber = room.RoomNumber,
            Floor = room.Floor,
            MaxOccupancy = room.MaxOccupancy,
            Description = room.Description,
            Building = room.Building,
            RoomSide = room.RoomSide,
            NearExit = room.NearExit,
            WheelchairAccessible = room.WheelchairAccessible,
            ElevatorAccess = room.ElevatorAccess,
            HallId = room.HallId,
            Images = room.Images.Select(x => x.ImageUrl).ToList(),
            Students = room.Beds
                .SelectMany(x => x.Assignments)
                .Select(x => new RoomStudentDto
                {
                    UserId = x.StudentId,
                    Name = x.Student.Firstname,
                    LastName = x.Student.Lastname
                })
                .ToList(),
            Beds = room.Beds
                .OrderBy(x => x.BedNumber)
                .Select(x => new RoomBedDto
                {
                    BedId = x.Id,
                    BedNumber = x.BedNumber,
                    Assignments = x.Assignments
                        .OrderByDescending(a => a.FromDate)
                        .Select(a => new RoomBedAssignmentDto
                        {
                            AssignmentId = a.Id,
                            FromDate = a.FromDate,
                            ToDate = a.ToDate,
                            StudentId = a.StudentId,
                            StudentFirstName = a.Student.Firstname,
                            StudentLastName = a.Student.Lastname
                        })
                        .ToList()
                })
                .ToList()
        };
    }
}
