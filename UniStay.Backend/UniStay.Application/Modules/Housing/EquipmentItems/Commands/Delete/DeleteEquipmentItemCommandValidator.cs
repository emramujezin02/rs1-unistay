namespace UniStay.Application.Modules.Housing.EquipmentItems.Commands.Delete;

public sealed class DeleteEquipmentItemCommandValidator : AbstractValidator<DeleteEquipmentItemCommand>
{
    public DeleteEquipmentItemCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0);
    }
}
