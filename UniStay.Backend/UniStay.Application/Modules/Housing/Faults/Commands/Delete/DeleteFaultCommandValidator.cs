namespace UniStay.Application.Modules.Housing.Faults.Commands.Delete;

public sealed class DeleteFaultCommandValidator : AbstractValidator<DeleteFaultCommand>
{
    public DeleteFaultCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0);
    }
}
