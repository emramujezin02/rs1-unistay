using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using UniStay.Infrastructure.BackgroundServices;
using UniStay.Infrastructure.Hubs;

namespace UniStay.Tests.SecurityTests.UnitTests;

public sealed class AnalyticsBackgroundServiceResilienceTests
{
    [Fact]
    public async Task ExecuteAsync_LogsIterationException_AndContinuesAfterExistingDelay()
    {
        var scopeFactory = new FailingScopeFactory();
        var clientProxy = new CapturingClientProxy();
        var logger = new CapturingLogger<AnalyticsBackgroundService>();

        var service = new AnalyticsBackgroundService(
            scopeFactory,
            new FakeHubContext(clientProxy),
            logger);

        await service.StartAsync(CancellationToken.None);

        await WaitUntilAsync(
            () => scopeFactory.CreateScopeCallCount >= 2 &&
                  logger.Errors.Count >= 2,
            TimeSpan.FromSeconds(8));

        await service.StopAsync(CancellationToken.None);

        Assert.True(scopeFactory.CreateScopeCallCount >= 2);
        Assert.True(logger.Errors.Count >= 2);

        Assert.All(
            logger.Errors,
            error =>
            {
                Assert.IsType<InvalidOperationException>(error.Exception);
                Assert.Contains(
                    "analytics background update",
                    error.Message,
                    StringComparison.OrdinalIgnoreCase);
            });
    }

    private static async Task WaitUntilAsync(
        Func<bool> condition,
        TimeSpan timeout)
    {
        var startedAt = DateTime.UtcNow;

        while (!condition())
        {
            if (DateTime.UtcNow - startedAt > timeout)
                throw new TimeoutException(
                    "Condition was not met before timeout.");

            await Task.Delay(100);
        }
    }

    private sealed class FailingScopeFactory : IServiceScopeFactory
    {
        public int CreateScopeCallCount { get; private set; }

        public IServiceScope CreateScope()
        {
            CreateScopeCallCount++;

            throw new InvalidOperationException(
                "Simulated transient analytics iteration failure.");
        }
    }

    private sealed class FakeHubContext(IClientProxy clientProxy)
        : IHubContext<AnalyticsHub>
    {
        public IHubClients Clients { get; } =
            new FakeHubClients(clientProxy);

        public IGroupManager Groups { get; } =
            new FakeGroupManager();
    }

    private sealed class FakeHubClients(IClientProxy clientProxy)
        : IHubClients
    {
        public IClientProxy All => clientProxy;

        public IClientProxy AllExcept(
            IReadOnlyList<string> excludedConnectionIds) =>
            clientProxy;

        public IClientProxy Client(string connectionId) =>
            clientProxy;

        public IClientProxy Clients(
            IReadOnlyList<string> connectionIds) =>
            clientProxy;

        public IClientProxy Group(string groupName) =>
            clientProxy;

        public IClientProxy GroupExcept(
            string groupName,
            IReadOnlyList<string> excludedConnectionIds) =>
            clientProxy;

        public IClientProxy Groups(
            IReadOnlyList<string> groupNames) =>
            clientProxy;

        public IClientProxy User(string userId) =>
            clientProxy;

        public IClientProxy Users(
            IReadOnlyList<string> userIds) =>
            clientProxy;
    }

    private sealed class FakeGroupManager : IGroupManager
    {
        public Task AddToGroupAsync(
            string connectionId,
            string groupName,
            CancellationToken cancellationToken = default) =>
            Task.CompletedTask;

        public Task RemoveFromGroupAsync(
            string connectionId,
            string groupName,
            CancellationToken cancellationToken = default) =>
            Task.CompletedTask;
    }

    private sealed class CapturingClientProxy : IClientProxy
    {
        public List<(string Method, object?[] Args)> SentMessages { get; } = [];

        public Task SendCoreAsync(
            string method,
            object?[] args,
            CancellationToken cancellationToken = default)
        {
            SentMessages.Add((method, args));
            return Task.CompletedTask;
        }
    }

    private sealed class CapturingLogger<T> : ILogger<T>
    {
        public List<(Exception? Exception, string Message)> Errors { get; } = [];

        public IDisposable BeginScope<TState>(TState state)
            where TState : notnull =>
            NullScope.Instance;

        public bool IsEnabled(LogLevel logLevel) => true;

        public void Log<TState>(
            LogLevel logLevel,
            EventId eventId,
            TState state,
            Exception? exception,
            Func<TState, Exception?, string> formatter)
        {
            if (logLevel == LogLevel.Error)
            {
                Errors.Add((
                    exception,
                    formatter(state, exception)));
            }
        }
    }

    private sealed class NullScope : IDisposable
    {
        public static readonly NullScope Instance = new();

        public void Dispose()
        {
        }
    }
}