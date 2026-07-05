using Microsoft.AspNetCore.SignalR;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace UniStay.Infrastructure.Hubs;

public sealed class UserIdProvider : IUserIdProvider
{
    public string? GetUserId(HubConnectionContext connection)
    {
        var user = connection.User;

        return user?.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? user?.FindFirst("id")?.Value
            ?? user?.FindFirst("nameid")?.Value
            ?? user?.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
    }
}
