namespace UniStay.Application.Modules.AccommodationApplications.Queries.GetAllApplications;

public sealed record GetAllApplicationsResult(
    IReadOnlyList<AdminApplicationListItemResult> Items,
    int TotalCount,
    int PageNumber,
    int PageSize)
{
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
}

public sealed record AdminApplicationListItemResult(
    int ApplicationId,
    int StudentId,
    string StudentUsername,
    string StudentEmail,
    string PreferredRoomType,
    int? PreferredRoomId,
    int YearOfStudy,
    decimal? GpaScore,
    string? PhoneNumber,
    string? SpecialRequirements,
    string? DocumentNames,
    string? Notes,
    string Status,
    DateTime AppliedAtUtc,
    DateTime? DecisionAtUtc,
    int? AssignedRoomId,
    int? DecisionByUserId);
