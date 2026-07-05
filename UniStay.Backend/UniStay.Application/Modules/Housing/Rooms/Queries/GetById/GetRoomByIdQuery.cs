namespace UniStay.Application.Modules.Housing.Rooms.Queries.GetById;

public sealed class GetRoomByIdQuery : IRequest<GetRoomByIdQueryDto>
{
    public int Id { get; set; }
}
