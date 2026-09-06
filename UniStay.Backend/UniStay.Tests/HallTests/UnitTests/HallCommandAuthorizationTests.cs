using UniStay.Application.Modules.Housing.Halls.Commands.Create;
using UniStay.Application.Modules.Housing.Halls.Commands.Delete;
using UniStay.Application.Modules.Housing.Halls.Commands.Update;
using UniStay.Tests.Services;

namespace UniStay.Tests.HallTests.UnitTests;

public class HallCommandAuthorizationTests
{
    private const int ExistingHallId = 1;

    [Fact]
    public async Task Create_Should_Reject_Student()
    {
        await using var db = TestDatabaseContext.Create();
        var handler = new CreateHallCommandHandler(db, new FakeAppCurrentUser(ApplicationTestDatabaseContext.StudentId));

        var command = CreateCommand("Blocked Hall");

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => handler.Handle(command, CancellationToken.None));
    }

    [Fact]
    public async Task Update_Should_Reject_Student()
    {
        await using var db = TestDatabaseContext.Create();
        var handler = new UpdateHallCommandHandler(db, new FakeAppCurrentUser(ApplicationTestDatabaseContext.StudentId));

        var command = new UpdateHallCommand
        {
            Id = ExistingHallId,
            Name = "Blocked Update",
            Capacity = 20,
            Description = "Valid desc",
            AvailableFrom = DateTime.UtcNow,
            AvailableTo = DateTime.UtcNow.AddDays(1),
            IsAvailable = true
        };

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => handler.Handle(command, CancellationToken.None));
    }

    [Fact]
    public async Task Delete_Should_Reject_Student()
    {
        await using var db = TestDatabaseContext.Create();
        var handler = new DeleteHallCommandHandler(db, new FakeAppCurrentUser(ApplicationTestDatabaseContext.StudentId));

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            handler.Handle(new DeleteHallCommand { Id = ExistingHallId }, CancellationToken.None));
    }

    [Fact]
    public async Task Create_Should_Allow_Admin()
    {
        await using var db = TestDatabaseContext.Create();
        var handler = new CreateHallCommandHandler(db, AdminUser());

        var id = await handler.Handle(CreateCommand("Admin Hall"), CancellationToken.None);

        Assert.NotEqual(0, id);
        Assert.NotNull(await db.Halls.FindAsync(id));
    }

    [Fact]
    public async Task Update_Should_Allow_Admin()
    {
        await using var db = TestDatabaseContext.Create();
        var handler = new UpdateHallCommandHandler(db, AdminUser());

        await handler.Handle(new UpdateHallCommand
        {
            Id = ExistingHallId,
            Name = "Admin Updated Hall",
            Capacity = 60,
            Description = "Updated desc",
            AvailableFrom = DateTime.UtcNow,
            AvailableTo = DateTime.UtcNow.AddDays(1),
            IsAvailable = false
        }, CancellationToken.None);

        var hall = await db.Halls.FindAsync(ExistingHallId);
        Assert.NotNull(hall);
        Assert.Equal("Admin Updated Hall", hall!.Name);
        Assert.False(hall.IsAvailable);
    }

    [Fact]
    public async Task Delete_Should_Allow_Admin()
    {
        await using var db = TestDatabaseContext.Create();
        var handler = new DeleteHallCommandHandler(db, AdminUser());

        await handler.Handle(new DeleteHallCommand { Id = ExistingHallId }, CancellationToken.None);

        Assert.False(await db.Halls.AsNoTracking().AnyAsync(x => x.Id == ExistingHallId));
    }

    private static FakeAppCurrentUser AdminUser() =>
        new(ApplicationTestDatabaseContext.AdminId, isAdmin: true);

    private static CreateHallCommand CreateCommand(string name) =>
        new()
        {
            Name = name,
            Capacity = 10,
            Description = "Valid desc",
            AvailableFrom = DateTime.UtcNow,
            AvailableTo = DateTime.UtcNow.AddDays(1),
            IsAvailable = true
        };
}
