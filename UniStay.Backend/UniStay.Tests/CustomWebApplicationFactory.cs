using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.DependencyInjection;
using UniStay.Tests.Authentication;

namespace UniStay.Tests;

public class CustomWebApplicationFactory<TProgram> : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("IntegrationTests");

        builder.ConfigureServices(services =>
        {
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = TestAuthHandler.SchemeName;
                options.DefaultChallengeScheme = TestAuthHandler.SchemeName;
            })
            .AddScheme<AuthenticationSchemeOptions, TestAuthHandler>(
                TestAuthHandler.SchemeName,
                _ => { });
        });
    }

    public Task<HttpClient> GetAuthenticatedClientAsync()
    {
        var client = CreateClient();

        return Task.FromResult(client);
    }
}