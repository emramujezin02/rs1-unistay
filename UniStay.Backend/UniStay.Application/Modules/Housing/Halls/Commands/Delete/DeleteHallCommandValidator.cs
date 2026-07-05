namespace UniStay.Application.Modules.Housing.Halls.Commands.Delete;

public sealed class DeleteHallCommandValidator : AbstractValidator<DeleteHallCommand>
{
    public DeleteHallCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0);
    }
}
