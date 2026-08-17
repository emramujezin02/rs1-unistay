namespace UniStay.Application.Modules.Housing.Equipment.Commands.Delete;

public sealed class DeleteEquipmentCommandValidator : AbstractValidator<DeleteEquipmentCommand>
{
    public DeleteEquipmentCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0);
    }
}
