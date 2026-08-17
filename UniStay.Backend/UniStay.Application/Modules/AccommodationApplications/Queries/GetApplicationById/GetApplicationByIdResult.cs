namespace UniStay.Application.Modules.AccommodationApplications.Queries.GetApplicationById;

public sealed record GetApplicationByIdResult(
    int ApplicationId,
    int StudentId,
    string StudentUsername,
    string StudentEmail,
    string StudentFirstName,
    string StudentLastName,
    string PreferredRoomType,
    string? Notes,
    string Status,
    DateTime AppliedAtUtc,
    DateTime? DecisionAtUtc,
    int? AssignedRoomId,
    string? AssignedRoomNumber,
    int? DecisionByUserId);
