namespace UniStay.Application.Modules.Housing.EquipmentItems.Commands.Create;

public sealed class CreateEquipmentItemCommandValidator : AbstractValidator<CreateEquipmentItemCommand>
{
    public CreateEquipmentItemCommandValidator()
    {
        RuleFor(x => x.EquipmentId).GreaterThan(0);
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
