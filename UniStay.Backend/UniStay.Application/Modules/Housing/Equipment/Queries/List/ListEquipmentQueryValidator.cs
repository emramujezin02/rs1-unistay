namespace UniStay.Application.Modules.Housing.Equipment.Queries.List;

public sealed class ListEquipmentQueryValidator : AbstractValidator<ListEquipmentQuery>
{
    public ListEquipmentQueryValidator()
    {
        RuleFor(x => x.MinQuantity)
            .GreaterThanOrEqualTo(0)
            .When(x => x.MinQuantity.HasValue);

        RuleFor(x => x.MaxQuantity)
            .GreaterThanOrEqualTo(0)
            .When(x => x.MaxQuantity.HasValue);

        RuleFor(x => x)
            .Must(x => !x.MinQuantity.HasValue || !x.MaxQuantity.HasValue || x.MinQuantity.Value <= x.MaxQuantity.Value)
            .WithMessage("MinQuantity must be less than or equal to MaxQuantity.");
    }
}
