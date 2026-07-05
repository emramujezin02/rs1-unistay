using UniStay.Application.Modules.Housing.Halls.Queries.List;
using UniStay.Tests.Services;

namespace UniStay.Tests.HallTests.UnitTests;

public class HallListQueryHandlerTests
{
    [Fact]
    public async Task Should_Return_All_Halls()
    {
        await using var db = TestDatabaseContext.Create();
        var handler = new ListHallsQueryHandler(db);

        var result = await handler.Handle(new ListHallsQuery(), CancellationToken.None);

        Assert.NotNull(result);
        Assert.NotEmpty(result.Items);
    }

    [Fact]
    public async Task Should_Filter_By_Name()
    {
        await using var db = TestDatabaseContext.Create();
        var handler = new ListHallsQueryHandler(db);

        var result = await handler.Handle(new ListHallsQuery { Name = "Test" }, CancellationToken.None);

        Assert.NotNull(result);
        Assert.All(result.Items, hall => Assert.Contains("Test", hall.Name));
    }
}
