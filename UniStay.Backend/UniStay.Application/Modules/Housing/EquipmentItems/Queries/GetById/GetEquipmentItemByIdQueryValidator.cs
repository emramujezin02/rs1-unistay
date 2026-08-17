namespace UniStay.Application.Modules.Housing.EquipmentItems.Queries.GetById;

public sealed class GetEquipmentItemByIdQueryValidator : AbstractValidator<GetEquipmentItemByIdQuery>
{
    public GetEquipmentItemByIdQueryValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0);
    }
}
