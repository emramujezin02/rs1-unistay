namespace UniStay.Application.Modules.Housing.Reviews.Commands.React;

public sealed class ReactToRoomReviewCommand : IRequest
{
    public int ReviewId { get; set; }
    public bool IsLike { get; set; }
}
