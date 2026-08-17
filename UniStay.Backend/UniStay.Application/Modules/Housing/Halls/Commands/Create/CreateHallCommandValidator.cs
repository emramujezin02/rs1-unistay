using UniStay.Domain.Entities.Housing;

namespace UniStay.Application.Modules.Housing.Halls.Commands.Create;

public sealed class CreateHallCommandValidator : AbstractValidator<CreateHallCommand>
{
    public CreateHallCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required.")
            .MaximumLength(HallEntity.Constraints.NameMaxLength);

        RuleFor(x => x.Capacity)
            .InclusiveBetween(HallEntity.Constraints.MinCapacity, HallEntity.Constraints.MaxCapacity);

        RuleFor(x => x.Description)
            .MaximumLength(HallEntity.Constraints.DescriptionMaxLength);

        RuleFor(x => x.AvailableFrom)
            .NotEmpty();

        RuleFor(x => x.AvailableTo)
            .NotEmpty()
            .GreaterThan(x => x.AvailableFrom)
            .WithMessage("AvailableTo must be after AvailableFrom.");
    }
}
