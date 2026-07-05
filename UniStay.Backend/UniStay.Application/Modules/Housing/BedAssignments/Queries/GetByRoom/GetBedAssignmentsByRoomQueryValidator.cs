namespace UniStay.Application.Modules.Housing.BedAssignments.Queries.GetByRoom;

public sealed class GetBedAssignmentsByRoomQueryValidator : AbstractValidator<GetBedAssignmentsByRoomQuery>
{
    public GetBedAssignmentsByRoomQueryValidator()
    {
        RuleFor(x => x.RoomId).GreaterThan(0);
    }
}
