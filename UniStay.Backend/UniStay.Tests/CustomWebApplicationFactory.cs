using UniStay.Application.Modules.Auth.Commands.Login;
using System.Net.Http.Headers;
using System.Net.Http.Json;

namespace UniStay.Tests;

public class CustomWebApplicationFactory<TProgram> : WebApplicationFactory<Program>
{
    private static string? _cachedToken;

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("IntegrationTests");
    }

    public async Task<HttpClient> GetAuthenticatedClientAsync()
    {
        var client = CreateClient();
        if (string.IsNullOrEmpty(_cachedToken))
        {
            var loginRequest = new
            {
                Email = "admin@unistay.ba",
                Password = "Admin123!"
            };

            var response = await client.PostAsJsonAsync("api/auth/login", loginRequest);
            response.EnsureSuccessStatusCode();

            var loginResponse = await response.Content.ReadFromJsonAsync<LoginCommandDto>();
            _cachedToken = loginResponse?.AccessToken
                ?? throw new InvalidOperationException("Login response did not include an access token.");
        }
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", _cachedToken);
        return client;
    }
}
