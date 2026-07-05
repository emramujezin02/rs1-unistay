namespace UniStay.Application.Modules.Housing.Faults.Commands.Delete;

public sealed class DeleteFaultCommand : IRequest<Unit>
{
    public int Id { get; set; }
}
