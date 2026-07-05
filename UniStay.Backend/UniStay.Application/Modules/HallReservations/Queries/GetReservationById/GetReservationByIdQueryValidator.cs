namespace UniStay.Application.Modules.HallReservations.Queries.GetReservationById;

public sealed class GetReservationByIdQueryValidator : AbstractValidator<GetReservationByIdQuery>
{
    public GetReservationByIdQueryValidator()
    {
        RuleFor(x => x.ReservationId)
            .GreaterThan(0).WithMessage("ReservationId is required.");
    }
}
