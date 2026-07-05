namespace UniStay.Application.Modules.AccommodationApplications.Commands.ApproveApplication;

public sealed record ApproveApplicationCommand(int ApplicationId, int BedId) : IRequest<ApproveApplicationResult>;
