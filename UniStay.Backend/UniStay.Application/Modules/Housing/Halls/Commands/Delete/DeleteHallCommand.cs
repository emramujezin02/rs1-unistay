namespace UniStay.Application.Modules.Housing.Halls.Commands.Delete;

public sealed class DeleteHallCommand : IRequest<Unit>
{
    public int Id { get; set; }
}
