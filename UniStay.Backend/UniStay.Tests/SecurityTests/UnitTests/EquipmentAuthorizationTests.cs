using UniStay.Application.Modules.Housing.Equipment.Commands.Create;
using UniStay.Application.Modules.Housing.Equipment.Commands.Delete;
using UniStay.Application.Modules.Housing.Equipment.Commands.Update;
using UniStay.Domain.Entities.Housing;
using UniStay.Tests.Services;

namespace UniStay.Tests.SecurityTests.UnitTests;

public class EquipmentAuthorizationTests
{
    private const int EquipmentId = 501;

    [Fact]
    public async Task Create_Should_Reject_Student()
    {
        await using var db = CreateDb();
        var handler = new CreateEquipmentCommandHandler(db, Student());

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            handler.Handle(CreateCommand("Student Equipment"), CancellationToken.None));

        Assert.False(await db.Equipment.AsNoTracking().AnyAsync(x => x.Name == "Student Equipment"));
    }

    [Fact]
    public async Task Update_Should_Reject_Student()
    {
        await using var db = CreateDb();
        var handler = new UpdateEquipmentCommandHandler(db, Student());

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            handler.Handle(UpdateCommand("Student Update"), CancellationToken.None));
    }

    [Fact]
    public async Task Delete_Should_Reject_Student()
    {
        await using var db = CreateDb();
        var handler = new DeleteEquipmentCommandHandler(db, Student());

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            handler.Handle(new DeleteEquipmentCommand { Id = EquipmentId }, CancellationToken.None));

        Assert.True(await db.Equipment.AsNoTracking().AnyAsync(x => x.Id == EquipmentId));
    }

    [Fact]
    public async Task Employee_Should_Create_And_Update_Equipment()
    {
        await using var db = CreateDb();

        var createdId = await new CreateEquipmentCommandHandler(db, Employee())
            .Handle(CreateCommand("Employee Equipment"), CancellationToken.None);
        await new UpdateEquipmentCommandHandler(db, Employee())
            .Handle(UpdateCommand("Employee Updated Equipment"), CancellationToken.None);

        Assert.NotEqual(0, createdId);
        Assert.True(await db.Equipment.AsNoTracking().AnyAsync(x => x.Name == "Employee Updated Equipment"));
    }

    [Fact]
    public async Task Admin_Should_Create_Update_And_Delete_Equipment()
    {
        await using var db = CreateDb();

        var createdId = await new CreateEquipmentCommandHandler(db, Admin())
            .Handle(CreateCommand("Admin Equipment"), CancellationToken.None);
        await new UpdateEquipmentCommandHandler(db, Admin())
            .Handle(UpdateCommand("Admin Updated Equipment"), CancellationToken.None);
        await new DeleteEquipmentCommandHandler(db, Admin())
            .Handle(new DeleteEquipmentCommand { Id = EquipmentId }, CancellationToken.None);

        Assert.NotEqual(0, createdId);
        Assert.False(await db.Equipment.AsNoTracking().AnyAsync(x => x.Id == EquipmentId));
    }

    private static DatabaseContext CreateDb()
    {
        var options = new DbContextOptionsBuilder<DatabaseContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        var db = new DatabaseContext(options, TimeProvider.System);
        db.Equipment.Add(new EquipmentEntity
        {
            Id = EquipmentId,
            Name = "Seed Equipment",
            Description = "Seed",
            RentalPrice = "10",
            EquipmentType = "Tool"
        });
        db.SaveChanges();
        return db;
    }

    private static CreateEquipmentCommand CreateCommand(string name) => new()
    {
        Name = name,
        Description = "Created",
        Quantity = 2,
        AvailableQuantity = 1,
        RentalPrice = "10",
        EquipmentType = "Tool"
    };

    private static UpdateEquipmentCommand UpdateCommand(string name) => new()
    {
        Id = EquipmentId,
        Name = name,
        Description = "Updated",
        Quantity = 1,
        AvailableQuantity = 1,
        RentalPrice = "12",
        EquipmentType = "Tool"
    };

    private static FakeAppCurrentUser Student() => new(601);

    private static FakeAppCurrentUser Employee() => new(602, isEmployee: true);

    private static FakeAppCurrentUser Admin() => new(603, isAdmin: true);
}
