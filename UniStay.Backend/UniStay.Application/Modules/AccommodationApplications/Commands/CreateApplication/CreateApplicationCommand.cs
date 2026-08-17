namespace UniStay.Application.Modules.AccommodationApplications.Commands.CreateApplication;

public sealed record CreateApplicationCommand(
    string PreferredRoomType,
    int? PreferredRoomId,
    int YearOfStudy,
    decimal? GpaScore,
    string? PhoneNumber,
    string? SpecialRequirements,
    string? DocumentNames,
    string? Notes) : IRequest<CreateApplicationResult>;
