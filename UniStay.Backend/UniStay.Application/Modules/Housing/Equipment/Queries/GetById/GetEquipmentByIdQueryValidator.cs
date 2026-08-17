namespace UniStay.Application.Modules.Housing.Equipment.Queries.GetById;

public sealed class GetEquipmentByIdQueryValidator : AbstractValidator<GetEquipmentByIdQuery>
{
    public GetEquipmentByIdQueryValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0);
    }
}
