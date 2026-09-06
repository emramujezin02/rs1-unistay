using UniStay.Application.Modules.Housing.Halls.Commands.Create;
using UniStay.Tests.Services;

namespace UniStay.Tests.HallTests.UnitTests;

public class HallCreateCommandHandlerTests
{
    [Fact]
    public async Task Should_Create_Hall()
    {
        await using var db = TestDatabaseContext.Create();
        var handler = new CreateHallCommandHandler(db, new FakeAppCurrentUser(ApplicationTestDatabaseContext.AdminId, isAdmin: true));
        var command = new CreateHallCommand
        {
            Name = "Hall",
            Capacity = 10,
            Description = "Valid desc",
            AvailableFrom = DateTime.UtcNow,
            AvailableTo = DateTime.UtcNow.AddDays(1),
            IsAvailable = true
        };

        var id = await handler.Handle(command, CancellationToken.None);

        var hall = await db.Halls.FindAsync(id);
        Assert.NotNull(hall);
        Assert.Equal("Hall", hall!.Name);
        Assert.Equal(10, hall.Capacity);
        Assert.True(hall.IsAvailable);
    }
}
