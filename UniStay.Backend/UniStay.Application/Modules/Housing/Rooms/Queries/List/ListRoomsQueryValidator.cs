namespace UniStay.Application.Modules.Housing.Rooms.Queries.List;

public sealed class ListRoomsQueryValidator : AbstractValidator<ListRoomsQuery>
{
    public ListRoomsQueryValidator()
    {
        RuleFor(x => x.Floor).GreaterThanOrEqualTo(0).When(x => x.Floor.HasValue);
        RuleFor(x => x.MaxOccupancy)
            .GreaterThanOrEqualTo(RoomEntity.Constraints.MinOccupancy)
            .LessThanOrEqualTo(RoomEntity.Constraints.MaxOccupancy)
            .When(x => x.MaxOccupancy.HasValue);
    }
}
