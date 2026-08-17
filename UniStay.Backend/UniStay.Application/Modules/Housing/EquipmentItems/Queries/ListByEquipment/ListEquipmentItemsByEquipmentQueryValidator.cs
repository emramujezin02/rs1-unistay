namespace UniStay.Application.Modules.Housing.EquipmentItems.Queries.ListByEquipment;

public sealed class ListEquipmentItemsByEquipmentQueryValidator : AbstractValidator<ListEquipmentItemsByEquipmentQuery>
{
    public ListEquipmentItemsByEquipmentQueryValidator()
    {
        RuleFor(x => x.EquipmentId).GreaterThan(0);
    }
}
