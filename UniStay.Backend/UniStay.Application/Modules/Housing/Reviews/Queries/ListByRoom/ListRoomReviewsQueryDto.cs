namespace UniStay.Application.Modules.Housing.Reviews.Queries.ListByRoom;

public sealed class ListRoomReviewsQueryDto
{
    [JsonPropertyName("roomReviewID")]
    public int RoomReviewId { get; set; }
    public string Comment { get; set; } = string.Empty;
    public int Rating { get; set; }
    public DateTime CreatedAt { get; set; }
    public string User { get; set; } = string.Empty;
    public int Likes { get; set; }
    public int Dislikes { get; set; }
}
