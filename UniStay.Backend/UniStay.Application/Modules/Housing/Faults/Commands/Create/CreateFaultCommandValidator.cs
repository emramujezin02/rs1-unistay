namespace UniStay.Application.Modules.Housing.Faults.Commands.Create;

public sealed class CreateFaultCommandValidator : AbstractValidator<CreateFaultCommand>
{
    public CreateFaultCommandValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty()
            .MinimumLength(FaultEntity.Constraints.TitleMinLength)
            .MaximumLength(FaultEntity.Constraints.TitleMaxLength);

        RuleFor(x => x.Description)
            .MaximumLength(FaultEntity.Constraints.DescriptionMaxLength);

        RuleFor(x => x.RoomId)
            .GreaterThan(0);
    }
}
