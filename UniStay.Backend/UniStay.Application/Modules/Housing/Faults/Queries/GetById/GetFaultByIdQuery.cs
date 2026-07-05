namespace UniStay.Application.Modules.Housing.Faults.Queries.GetById;

public sealed class GetFaultByIdQuery : IRequest<GetFaultByIdQueryDto>
{
    public int Id { get; set; }
}
