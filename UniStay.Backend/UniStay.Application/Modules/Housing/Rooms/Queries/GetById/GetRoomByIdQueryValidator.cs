namespace UniStay.Application.Modules.Housing.Rooms.Queries.GetById;

public sealed class GetRoomByIdQueryValidator : AbstractValidator<GetRoomByIdQuery>
{
    public GetRoomByIdQueryValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0);
    }
}
