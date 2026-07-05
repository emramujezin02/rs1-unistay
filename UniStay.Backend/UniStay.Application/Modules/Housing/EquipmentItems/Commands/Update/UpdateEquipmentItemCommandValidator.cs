namespace UniStay.Application.Modules.Housing.EquipmentItems.Commands.Update;

public sealed class UpdateEquipmentItemCommandValidator : AbstractValidator<UpdateEquipmentItemCommand>
{
    public UpdateEquipmentItemCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0);
        RuleFor(x => x.SerialNumber).MaximumLength(EquipmentItemEntity.Constraints.SerialNumberMaxLength);
        RuleFor(x => x.Location).MaximumLength(EquipmentItemEntity.Constraints.LocationMaxLength);

        RuleFor(x => x)
            .Must(x => x.IsAvailable || !string.IsNullOrWhiteSpace(x.SerialNumber))
            .WithMessage("SerialNumber is required for occupied items.");

        RuleFor(x => x)
            .Must(x => x.IsAvailable || (x.AssignedAtUtc.HasValue && x.ReturnedAtUtc.HasValue && !string.IsNullOrWhiteSpace(x.Location)))
            .WithMessage("AssignedAtUtc, ReturnedAtUtc and Location are required for occupied items.");
    }
}
