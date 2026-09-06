using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using UniStay.Application.Abstractions;
using UniStay.Application.Modules.Communication.Analytics.Queries.GetSnapshot;
using UniStay.Infrastructure.Hubs;

namespace UniStay.Infrastructure.BackgroundServices;

public sealed class AnalyticsBackgroundService(
    IServiceScopeFactory scopeFactory,
    IHubContext<AnalyticsHub> hub,
    ILogger<AnalyticsBackgroundService> logger)
    : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = scopeFactory.CreateScope();

                var context = scope.ServiceProvider
                    .GetRequiredService<IAppDbContext>();

                var timeProvider = scope.ServiceProvider
                    .GetRequiredService<TimeProvider>();

                var data = await AnalyticsSnapshotProvider.GetAsync(
                    context,
                    timeProvider,
                    stoppingToken);

                data.ActiveUsers = Math.Max(
                    data.ActiveUsers,
                    ChatHub.GetActiveUserCount());

                await hub.Clients.All.SendAsync(
                    "AnalyticsUpdated",
                    data,
                    stoppingToken);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                break;
            }
            catch (Exception ex)
            {
                logger.LogError(
                    ex,
                    "An error occurred while processing analytics background update.");
            }

            try
            {
                await Task.Delay(
                    TimeSpan.FromSeconds(5),
                    stoppingToken);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                break;
            }
        }
    }
}