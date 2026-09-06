using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace UniStay.Infrastructure.Hubs;

[Authorize(Policy = "AdminOnly")]
public sealed class AnalyticsHub : Hub
{
}