using MediatR;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using UniStay.Application.Modules.Communication.Analytics.Queries.GetSnapshot;
using UniStay.Infrastructure.Hubs;

namespace UniStay.Infrastructure.BackgroundServices;

public sealed class AnalyticsBackgroundService(IServiceScopeFactory scopeFactory, IHubContext<AnalyticsHub> hub)
    : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using var scope = scopeFactory.CreateScope();
            var sender = scope.ServiceProvider.GetRequiredService<ISender>();

            var data = await sender.Send(new GetAnalyticsSnapshotQuery(), stoppingToken);
            data.ActiveUsers = Math.Max(data.ActiveUsers, ChatHub.GetActiveUserCount());

            await hub.Clients.All.SendAsync("AnalyticsUpdated", data, stoppingToken);
            await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
        }
    }
}
