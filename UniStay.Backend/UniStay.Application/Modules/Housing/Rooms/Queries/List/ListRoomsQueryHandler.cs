using UniStay.Application.Modules.Housing.Rooms.Common;

namespace UniStay.Application.Modules.Housing.Rooms.Queries.List;

public sealed class ListRoomsQueryHandler(IAppDbContext context)
    : IRequestHandler<ListRoomsQuery, PageResult<ListRoomsQueryDto>>
{
    public async Task<PageResult<ListRoomsQueryDto>> Handle(ListRoomsQuery request, CancellationToken ct)
    {
        var searchTerm = request.Q ?? request.SearchTerm;
        var pageNumber = request.PageNumber.GetValueOrDefault(request.Paging.Page);
        var pageSize = request.PageSize.GetValueOrDefault(request.Paging.PageSize);
        pageNumber = pageNumber <= 0 ? 1 : pageNumber;
        pageSize = pageSize <= 0 ? 10 : Math.Min(pageSize, 10000);

        var query = context.Rooms
            .AsNoTracking()
            .Include(x => x.Images)
            .Include(x => x.Beds)
            .ThenInclude(x => x.Assignments)
            .ThenInclude(x => x.Student)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var search = searchTerm.Trim().ToLower();

            query = query.Where(x =>
                x.RoomNumber.ToLower().Contains(search) ||
                ("room " + x.RoomNumber).ToLower().Contains(search) ||
                ("soba " + x.RoomNumber).ToLower().Contains(search) ||
                x.Description.ToLower().Contains(search)
            );
        }

        if (request.Floor.HasValue)
            query = query.Where(x => x.Floor == request.Floor.Value);

        if (!string.IsNullOrWhiteSpace(request.Building))
            query = query.Where(x => x.Building == request.Building);

        if (!string.IsNullOrWhiteSpace(request.RoomSide))
            query = query.Where(x => x.RoomSide == request.RoomSide);

        if (request.MaxOccupancy.HasValue)
            query = query.Where(x => x.MaxOccupancy == request.MaxOccupancy.Value);

        if (request.NearExit == true)
            query = query.Where(x => x.NearExit);

        if (request.WheelchairAccessible == true)
            query = query.Where(x => x.WheelchairAccessible);

        if (request.ElevatorAccess == true)
            query = query.Where(x => x.ElevatorAccess);

        var rooms = await query
            .OrderBy(x => x.RoomNumber)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        var total = await query.CountAsync(ct);

        return new PageResult<ListRoomsQueryDto>
        {
            Items = rooms.Select(MapRoom).ToList(),
            PageSize = pageSize,
            CurrentPage = pageNumber,
            IncludedTotal = true,
            TotalItems = total,
            TotalPages = (int)Math.Ceiling(total / (double)pageSize)
        };
    }

    private static ListRoomsQueryDto MapRoom(RoomEntity room)
    {
        return new ListRoomsQueryDto
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
            OccupiedBeds = room.Beds.Count(x => x.Assignments.Any(a => a.ToDate.Date >= DateTime.UtcNow.Date)),
            AvailableBeds = room.Beds.Count(x => !x.Assignments.Any(a => a.ToDate.Date >= DateTime.UtcNow.Date)),
            Images = room.Images
    .Where(x => !x.IsDeleted)
    .Select(x => x.ImageUrl.TrimStart('/'))
    .Select(x => x.StartsWith("images/") ? "/" + x : "/images/" + x)
    .ToList(),
            Students = room.Beds
                .SelectMany(x => x.Assignments)
                .Select(x => new RoomStudentDto
                {
                    UserId = x.StudentId,
                    Name = x.Student.Firstname,
                    LastName = x.Student.Lastname
                })
                .ToList()
        };
    }
}
