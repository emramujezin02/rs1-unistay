namespace UniStay.Application.Modules.Housing.Faults.Queries.List;

public sealed class ListFaultsQueryValidator : AbstractValidator<ListFaultsQuery>
{
    public ListFaultsQueryValidator()
    {
        RuleFor(x => x.ReportedByUserId)
            .GreaterThan(0)
            .When(x => x.ReportedByUserId.HasValue);

        RuleFor(x => x.RoomId)
            .GreaterThan(0)
            .When(x => x.RoomId.HasValue);

        RuleFor(x => x)
            .Must(x => !x.From.HasValue || !x.To.HasValue || x.From.Value <= x.To.Value)
            .WithMessage("From must be less than or equal to To.");
    }
}
