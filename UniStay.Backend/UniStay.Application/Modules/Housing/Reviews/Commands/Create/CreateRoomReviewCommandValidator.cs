namespace UniStay.Application.Modules.Housing.Reviews.Commands.Create;

public sealed class CreateRoomReviewCommandValidator : AbstractValidator<CreateRoomReviewCommand>
{
    public CreateRoomReviewCommandValidator()
    {
        RuleFor(x => x.RoomId).GreaterThan(0);
        RuleFor(x => x.Rating)
            .GreaterThanOrEqualTo(RoomReviewEntity.Constraints.MinRating)
            .LessThanOrEqualTo(RoomReviewEntity.Constraints.MaxRating);
        RuleFor(x => x.Comment)
            .NotEmpty()
            .MaximumLength(RoomReviewEntity.Constraints.CommentMaxLength);
    }
}
