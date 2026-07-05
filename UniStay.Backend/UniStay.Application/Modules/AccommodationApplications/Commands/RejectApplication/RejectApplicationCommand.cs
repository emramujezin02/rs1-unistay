namespace UniStay.Application.Modules.AccommodationApplications.Commands.RejectApplication;

public sealed record RejectApplicationCommand(int ApplicationId) : IRequest<RejectApplicationResult>;
