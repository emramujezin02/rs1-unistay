namespace UniStay.Application.Modules.Housing.Halls.Queries.GetById;

public sealed class GetHallByIdQuery : IRequest<GetHallByIdQueryDto>
{
    public int Id { get; set; }
}
