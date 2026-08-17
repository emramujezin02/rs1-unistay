namespace UniStay.Application.Modules.Housing.Beds.Queries.List;

public sealed class ListBedsQueryValidator : AbstractValidator<ListBedsQuery>
{
    public ListBedsQueryValidator()
    {
        RuleFor(x => x.RoomId)
            .GreaterThan(0)
            .When(x => x.RoomId.HasValue);
    }
}
