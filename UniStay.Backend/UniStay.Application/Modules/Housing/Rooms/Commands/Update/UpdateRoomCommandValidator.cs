namespace UniStay.Application.Modules.Housing.Rooms.Commands.Update;

public sealed class UpdateRoomCommandValidator : AbstractValidator<UpdateRoomCommand>
{
    public UpdateRoomCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0);
        RuleFor(x => x.RoomNumber).MaximumLength(RoomEntity.Constraints.RoomNumberMaxLength);
        RuleFor(x => x.Floor).GreaterThanOrEqualTo(0).When(x => x.Floor.HasValue);
        RuleFor(x => x.MaxOccupancy)
            .GreaterThanOrEqualTo(RoomEntity.Constraints.MinOccupancy)
            .LessThanOrEqualTo(RoomEntity.Constraints.MaxOccupancy)
            .When(x => x.MaxOccupancy.HasValue);
        RuleFor(x => x.Description).MaximumLength(RoomEntity.Constraints.DescriptionMaxLength);
        RuleFor(x => x.Building).MaximumLength(RoomEntity.Constraints.BuildingMaxLength);
        RuleFor(x => x.RoomSide).MaximumLength(RoomEntity.Constraints.RoomSideMaxLength);
        RuleFor(x => x.HallId).GreaterThan(0).When(x => x.HallId.HasValue);
        RuleForEach(x => x.Images).MaximumLength(500);
    }
}
