namespace UniStay.Application.Modules.Housing.Reviews.Commands.React;

public sealed class ReactToRoomReviewCommandValidator : AbstractValidator<ReactToRoomReviewCommand>
{
    public ReactToRoomReviewCommandValidator()
    {
        RuleFor(x => x.ReviewId).GreaterThan(0);
    }
}
