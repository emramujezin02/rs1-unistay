namespace UniStay.Application.Modules.Housing.Rooms.Commands.Create;

public sealed class CreateRoomCommandValidator : AbstractValidator<CreateRoomCommand>
{
    public CreateRoomCommandValidator()
    {
        RuleFor(x => x.RoomNumber).NotEmpty().MaximumLength(RoomEntity.Constraints.RoomNumberMaxLength);
        RuleFor(x => x.Floor).GreaterThanOrEqualTo(0);
        RuleFor(x => x.MaxOccupancy)
            .GreaterThanOrEqualTo(RoomEntity.Constraints.MinOccupancy)
            .LessThanOrEqualTo(RoomEntity.Constraints.MaxOccupancy);
        RuleFor(x => x.Description).NotEmpty().MaximumLength(RoomEntity.Constraints.DescriptionMaxLength);
        RuleFor(x => x.Building).MaximumLength(RoomEntity.Constraints.BuildingMaxLength);
        RuleFor(x => x.RoomSide).MaximumLength(RoomEntity.Constraints.RoomSideMaxLength);
        RuleFor(x => x.HallId).GreaterThan(0).When(x => x.HallId.HasValue);
        RuleForEach(x => x.Images).MaximumLength(500);
    }
}
