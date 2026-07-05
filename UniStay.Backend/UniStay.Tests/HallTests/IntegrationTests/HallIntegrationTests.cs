using System.Net;
using System.Net.Http.Json;
using UniStay.Application.Common;
using UniStay.Application.Modules.Housing.Halls.Commands.Create;
using UniStay.Application.Modules.Housing.Halls.Queries.List;

namespace UniStay.Tests.HallTests.IntegrationTests;

public class HallIntegrationTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly CustomWebApplicationFactory<Program> _factory;

    public HallIntegrationTests(CustomWebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Post_CreateHall_ShouldReturnCreated()
    {
        var client = await _factory.GetAuthenticatedClientAsync();
        var request = new CreateHallCommand
        {
            Name = $"Integration Test Hall {Guid.NewGuid():N}",
            Capacity = 10,
            Description = "Valid desc",
            AvailableFrom = DateTime.UtcNow,
            AvailableTo = DateTime.UtcNow.AddDays(1),
            IsAvailable = true
        };

        var response = await client.PostAsJsonAsync("/Halls", request);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var result = await response.Content.ReadFromJsonAsync<Dictionary<string, int>>();
        Assert.NotNull(result);
        Assert.True(result!.ContainsKey("id"));
        Assert.NotEqual(0, result["id"]);
    }

    [Fact]
    public async Task Get_Halls_ShouldReturnList()
    {
        var client = await _factory.GetAuthenticatedClientAsync();

        var result = await client.GetFromJsonAsync<PageResult<ListHallsQueryDto>>("/Halls");

        Assert.NotNull(result);
        Assert.NotEmpty(result!.Items);
    }
}
