namespace UniStay.Application.Modules.Housing.EquipmentItems.Commands.Availability;

public sealed class UpdateEquipmentItemAvailabilityCommandValidator : AbstractValidator<UpdateEquipmentItemAvailabilityCommand>
{
    public UpdateEquipmentItemAvailabilityCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0);
    }
}
