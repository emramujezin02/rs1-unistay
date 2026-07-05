namespace UniStay.Application.Modules.Housing.BedAssignments.Commands.Delete;

public sealed class DeleteBedAssignmentCommand : IRequest<Unit>
{
    public int Id { get; set; }
}
