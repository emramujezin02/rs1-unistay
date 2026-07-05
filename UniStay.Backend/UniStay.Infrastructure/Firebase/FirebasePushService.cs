using FirebaseAdmin;
using FirebaseAdmin.Messaging;
using Google.Apis.Auth.OAuth2;
using Microsoft.Extensions.Configuration;
using UniStay.Application.Abstractions;

namespace UniStay.Infrastructure.Firebase;

public sealed class FirebasePushService : IFirebasePushService
{
    public FirebasePushService(IConfiguration configuration)
    {
        if (FirebaseApp.DefaultInstance is not null)
            return;

        var serviceAccountJson = configuration["Firebase:ServiceAccountJson"];

        if (string.IsNullOrWhiteSpace(serviceAccountJson) ||
            serviceAccountJson == "TODO_CONFIGURE_FIREBASE_SERVICE_ACCOUNT_JSON")
            return;

        FirebaseApp.Create(new AppOptions
        {
            Credential = GoogleCredential.FromJson(serviceAccountJson)
        });
    }

    public async Task SendAsync(
        string fcmToken,
        string title,
        string body,
        CancellationToken cancellationToken = default)
    {
        try
        {
            if (FirebaseApp.DefaultInstance is null)
                return;

            var message = new Message
            {
                Token = fcmToken,
                Notification = new Notification
                {
                    Title = title,
                    Body = body
                }
            };

            await FirebaseMessaging.DefaultInstance.SendAsync(message, cancellationToken);
        }
        catch
        {
            // Push delivery is best-effort and must not break the main notification flow.
        }
    }
}
