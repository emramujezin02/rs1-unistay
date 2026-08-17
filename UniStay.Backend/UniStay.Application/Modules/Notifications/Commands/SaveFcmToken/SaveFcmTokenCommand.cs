namespace UniStay.Application.Modules.Notifications.Commands.SaveFcmToken;

public sealed record SaveFcmTokenCommand(string Token) : IRequest;
