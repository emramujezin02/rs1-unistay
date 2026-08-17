namespace UniStay.Application.Modules.Housing.EquipmentItems.Commands.Assign;

public sealed class AssignEquipmentItemCommandValidator : AbstractValidator<AssignEquipmentItemCommand>
{
    public AssignEquipmentItemCommandValidator()
    {
        RuleFor(x => x.EquipmentItemId).GreaterThan(0);
        RuleFor(x => x.Location).MaximumLength(EquipmentItemEntity.Constraints.LocationMaxLength);
        RuleFor(x => x.StudentId).GreaterThan(0).When(x => x.StudentId.HasValue);
        RuleFor(x => x.EmployeeId).GreaterThan(0).When(x => x.EmployeeId.HasValue);
    }
}
