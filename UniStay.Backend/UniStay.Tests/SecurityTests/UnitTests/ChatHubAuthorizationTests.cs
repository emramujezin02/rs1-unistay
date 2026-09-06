using System.Security.Claims;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.SignalR;
using UniStay.Infrastructure.Hubs;

namespace UniStay.Tests.SecurityTests.UnitTests;

public class ChatHubAuthorizationTests
{
    [Fact]
    public async Task ChatHub_Should_Register_Connection_From_Claim_UserId()
    {
        const int authenticatedUserId = 9101;
        const string connectionId = "chat-security-test-connection";

        var hub = new ChatHub
        {
            Context = new TestHubCallerContext(
                connectionId,
                CreatePrincipal(authenticatedUserId))
        };

        await hub.OnConnectedAsync();

        Assert.Equal(connectionId, ChatHub.GetConnection(authenticatedUserId));
    }

    [Fact]
    public void ChatHub_Should_Not_Read_UserId_From_Query_String()
    {
        var source = File.ReadAllText(GetChatHubPath());

        Assert.DoesNotContain("Request.Query[\"userId\"]", source);
        Assert.DoesNotContain("Request.Query['userId']", source);
    }

    [Fact]
    public void Frontend_Chat_StartConnection_Should_Not_Send_UserId_Query_String()
    {
        var source = File.ReadAllText(GetFrontendChatServicePath());

        Assert.DoesNotContain("?userId=", source);
        Assert.DoesNotContain("hubs/chat?userId", source);
    }

    [Fact]
    public void Legacy_ChatController_Should_Not_Remain_In_Api_Project()
    {
        Assert.False(File.Exists(GetLegacyChatControllerPath()));
    }

    [Fact]
    public void Frontend_Chat_Service_Should_Not_Call_Legacy_ChatController_Routes()
    {
        var source = File.ReadAllText(GetFrontendChatServicePath());

        Assert.DoesNotContain("/api/messages/send", source);
        Assert.DoesNotContain("/api/chat/conversations", source);
        Assert.DoesNotContain("/api/chat/messages", source);
    }

    private static string GetChatHubPath()
    {
        var root = GetRepositoryRoot();
        return Path.Combine(root, "UniStay.Backend", "UniStay.Infrastructure", "Hubs", "ChatHub.cs");
    }

    private static string GetFrontendChatServicePath()
    {
        var root = GetRepositoryRoot();
        return Path.Combine(root, "UniStay.Frontend", "src", "app", "endpoints", "message-endpoints", "chat-service.ts");
    }

    private static string GetLegacyChatControllerPath()
    {
        var root = GetRepositoryRoot();
        return Path.Combine(root, "UniStay.Backend", "UniStay.API", "Controllers", "ChatController.cs");
    }

    private static string GetRepositoryRoot()
    {
        var current = new DirectoryInfo(AppContext.BaseDirectory);

        while (current is not null)
        {
            if (Directory.Exists(Path.Combine(current.FullName, "UniStay.Backend")) &&
                Directory.Exists(Path.Combine(current.FullName, "UniStay.Frontend")))
            {
                return current.FullName;
            }

            current = current.Parent;
        }

        throw new DirectoryNotFoundException("Could not locate RazvojSoftvera1 repository root.");
    }

    private static ClaimsPrincipal CreatePrincipal(int userId) =>
        new(new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString())
        }, "TestJwt"));

    private sealed class TestHubCallerContext(
        string connectionId,
        ClaimsPrincipal user) : HubCallerContext
    {
        private readonly FeatureCollection features = new();

        public override string ConnectionId { get; } = connectionId;
        public override string? UserIdentifier => null;
        public override ClaimsPrincipal? User { get; } = user;
        public override IDictionary<object, object?> Items { get; } = new Dictionary<object, object?>();
        public override IFeatureCollection Features => features;
        public override CancellationToken ConnectionAborted => CancellationToken.None;
        public override void Abort()
        {
        }
    }
}
