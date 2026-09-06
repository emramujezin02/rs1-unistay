using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace UniStay.Infrastructure.Hubs;

[Authorize]
public sealed class ChatHub : Hub
{
    private static readonly ConcurrentDictionary<int, string> Connections = new();

    public override Task OnConnectedAsync()
    {
        var userId = ResolveUserId();
        if (userId.HasValue)
            Connections[userId.Value] = Context.ConnectionId;

        return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        var connection = Connections.FirstOrDefault(x => x.Value == Context.ConnectionId);
        if (connection.Key > 0)
            Connections.TryRemove(connection.Key, out _);

        return base.OnDisconnectedAsync(exception);
    }

    public async Task Typing(int receiverId)
    {
        var senderId = ResolveUserId();
        if (!senderId.HasValue)
            return;

        var connectionId = GetConnection(receiverId);
        if (connectionId is not null)
            await Clients.Client(connectionId).SendAsync("UserTyping", senderId.Value);
    }

    public static string? GetConnection(int userId)
    {
        return Connections.TryGetValue(userId, out var connectionId) ? connectionId : null;
    }

    public static int GetActiveUserCount()
    {
        return Connections.Count;
    }

    private int? ResolveUserId()
    {
        var userIdFromClaim =
            Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? Context.User?.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
            ?? Context.User?.FindFirst("nameid")?.Value;

        if (int.TryParse(userIdFromClaim, out var claimUserId))
            return claimUserId;

        return null;
    }
}
