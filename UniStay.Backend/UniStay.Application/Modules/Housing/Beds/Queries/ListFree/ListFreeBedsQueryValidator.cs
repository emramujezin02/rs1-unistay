namespace UniStay.Application.Modules.Housing.Beds.Queries.ListFree;

public sealed class ListFreeBedsQueryValidator : AbstractValidator<ListFreeBedsQuery>
{
    public ListFreeBedsQueryValidator()
    {
        RuleFor(x => x.RoomId)
            .GreaterThan(0)
            .When(x => x.RoomId.HasValue);

        RuleFor(x => x.ToDate)
            .GreaterThan(x => x.FromDate)
            .When(x => x.FromDate.HasValue && x.ToDate.HasValue);
    }
}
