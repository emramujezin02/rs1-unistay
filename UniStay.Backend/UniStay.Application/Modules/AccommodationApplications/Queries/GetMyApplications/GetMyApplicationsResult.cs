namespace UniStay.Application.Modules.AccommodationApplications.Queries.GetMyApplications;

public sealed record GetMyApplicationsResult(IReadOnlyList<ApplicationListItemResult> Items);

public sealed record ApplicationListItemResult(
    int ApplicationId,
    string PreferredRoomType,
    int? PreferredRoomId,
    int YearOfStudy,
    decimal? GpaScore,
    string? PhoneNumber,
    string? SpecialRequirements,
    string? DocumentNames,
    string? Notes,
    string Status,
    DateTime AppliedAt,
    DateTime? DecisionAt,
    int? AssignedRoomId);
