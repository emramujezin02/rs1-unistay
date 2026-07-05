namespace UniStay.Application.Modules.Housing.Equipment.Commands.Update;

public sealed class UpdateEquipmentCommandValidator : AbstractValidator<UpdateEquipmentCommand>
{
    public UpdateEquipmentCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0);

        RuleFor(x => x.Name)
            .MinimumLength(EquipmentEntity.Constraints.NameMinLength)
            .MaximumLength(EquipmentEntity.Constraints.NameMaxLength)
            .When(x => !string.IsNullOrWhiteSpace(x.Name));

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
