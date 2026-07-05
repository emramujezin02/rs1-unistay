namespace UniStay.Application.Modules.Housing.Faults.Commands.Update;

public sealed class UpdateFaultCommandValidator : AbstractValidator<UpdateFaultCommand>
{
    public UpdateFaultCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0);

        RuleFor(x => x.Title)
            .NotEmpty()
            .MinimumLength(FaultEntity.Constraints.TitleMinLength)
            .MaximumLength(FaultEntity.Constraints.TitleMaxLength);

        RuleFor(x => x.Description)
            .MaximumLength(FaultEntity.Constraints.DescriptionMaxLength);

        RuleFor(x => x.Status)
            .NotEmpty()
            .MaximumLength(FaultEntity.Constraints.StatusMaxLength);

        RuleFor(x => x.Priority)
            .MaximumLength(FaultEntity.Constraints.PriorityMaxLength);

        RuleFor(x => x)
            .Must(x => x.IsResolved != true || x.ResolvedAtUtc.HasValue)
            .WithMessage("ResolvedAtUtc is required when fault is resolved.");
    }
}
