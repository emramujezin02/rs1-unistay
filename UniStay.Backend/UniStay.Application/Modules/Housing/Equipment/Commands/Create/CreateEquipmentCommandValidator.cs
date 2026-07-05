namespace UniStay.Application.Modules.Housing.Equipment.Commands.Create;

public sealed class CreateEquipmentCommandValidator : AbstractValidator<CreateEquipmentCommand>
{
    public CreateEquipmentCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .MinimumLength(EquipmentEntity.Constraints.NameMinLength)
            .MaximumLength(EquipmentEntity.Constraints.NameMaxLength);

        RuleFor(x => x.Description)
            .MaximumLength(EquipmentEntity.Constraints.DescriptionMaxLength);

        RuleFor(x => x.Quantity)
            .GreaterThanOrEqualTo(0);

        RuleFor(x => x.AvailableQuantity)
            .GreaterThanOrEqualTo(0)
            .LessThanOrEqualTo(x => x.Quantity);

        RuleFor(x => x.RentalPrice)
            .MaximumLength(EquipmentEntity.Constraints.RentalPriceMaxLength);

        RuleFor(x => x.EquipmentType)
            .MaximumLength(EquipmentEntity.Constraints.EquipmentTypeMaxLength);
    }
}
