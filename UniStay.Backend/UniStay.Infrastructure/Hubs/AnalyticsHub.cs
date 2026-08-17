using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace UniStay.Infrastructure.Hubs;

[Authorize]
public sealed class AnalyticsHub : Hub
{
}
