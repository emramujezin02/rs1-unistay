using UniStay.Application.Modules.Housing.EquipmentItems.Commands.Assign;
using UniStay.Application.Modules.Housing.EquipmentItems.Commands.Availability;
using UniStay.Application.Modules.Housing.EquipmentItems.Commands.Create;
using UniStay.Application.Modules.Housing.EquipmentItems.Commands.Delete;
using UniStay.Application.Modules.Housing.EquipmentItems.Commands.Update;
using UniStay.Domain.Entities.Housing;
using UniStay.Tests.Services;

namespace UniStay.Tests.SecurityTests.UnitTests;

public class EquipmentItemAuthorizationTests
{
    private const int EquipmentId = 701;
    private const int EquipmentItemId = 702;

    [Fact]
    public async Task Create_Should_Reject_Student()
    {
        await using var db = CreateDb();
        var handler = new CreateEquipmentItemCommandHandler(db, Student());

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            handler.Handle(CreateCommand("S-NEW"), CancellationToken.None));
    }

    [Fact]
    public async Task Update_Should_Reject_Student()
    {
        await using var db = CreateDb();
        var handler = new UpdateEquipmentItemCommandHandler(db, Student());

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            handler.Handle(UpdateCommand("S-UPD"), CancellationToken.None));
    }

    [Fact]
    public async Task Delete_Should_Reject_Student()
    {
        await using var db = CreateDb();
        var handler = new DeleteEquipmentItemCommandHandler(db, Student());

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            handler.Handle(new DeleteEquipmentItemCommand { Id = EquipmentItemId }, CancellationToken.None));

        Assert.True(await db.EquipmentItems.AsNoTracking().AnyAsync(x => x.Id == EquipmentItemId));
    }

    [Fact]
    public async Task Availability_Should_Reject_Student()
    {
        await using var db = CreateDb();
        var handler = new UpdateEquipmentItemAvailabilityCommandHandler(db, Student());

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            handler.Handle(new UpdateEquipmentItemAvailabilityCommand { Id = EquipmentItemId, IsAvailable = false }, CancellationToken.None));
    }

    [Fact]
    public async Task Assign_Should_Reject_Student()
    {
        await using var db = CreateDb();
        var handler = new AssignEquipmentItemCommandHandler(db, Student());

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            handler.Handle(AssignCommand(), CancellationToken.None));
    }

    [Fact]
    public async Task Employee_Should_Use_All_Privileged_Item_Operations()
    {
        await using var db = CreateDb();

        var createdId = await new CreateEquipmentItemCommandHandler(db, Employee())
            .Handle(CreateCommand("EMP-NEW"), CancellationToken.None);
        await new UpdateEquipmentItemCommandHandler(db, Employee())
            .Handle(UpdateCommand("EMP-UPD"), CancellationToken.None);
        await new UpdateEquipmentItemAvailabilityCommandHandler(db, Employee())
            .Handle(new UpdateEquipmentItemAvailabilityCommand { Id = EquipmentItemId, IsAvailable = false }, CancellationToken.None);
        await new AssignEquipmentItemCommandHandler(db, Employee())
            .Handle(AssignCommand(), CancellationToken.None);
        await new DeleteEquipmentItemCommandHandler(db, Employee())
            .Handle(new DeleteEquipmentItemCommand { Id = EquipmentItemId }, CancellationToken.None);

        Assert.NotEqual(0, createdId);
        Assert.False(await db.EquipmentItems.AsNoTracking().AnyAsync(x => x.Id == EquipmentItemId));
    }

    [Fact]
    public async Task Admin_Should_Use_All_Privileged_Item_Operations()
    {
        await using var db = CreateDb();

        var createdId = await new CreateEquipmentItemCommandHandler(db, Admin())
            .Handle(CreateCommand("ADM-NEW"), CancellationToken.None);
        await new UpdateEquipmentItemCommandHandler(db, Admin())
            .Handle(UpdateCommand("ADM-UPD"), CancellationToken.None);
        await new UpdateEquipmentItemAvailabilityCommandHandler(db, Admin())
            .Handle(new UpdateEquipmentItemAvailabilityCommand { Id = EquipmentItemId, IsAvailable = false }, CancellationToken.None);
        await new AssignEquipmentItemCommandHandler(db, Admin())
            .Handle(AssignCommand(), CancellationToken.None);
        await new DeleteEquipmentItemCommandHandler(db, Admin())
            .Handle(new DeleteEquipmentItemCommand { Id = EquipmentItemId }, CancellationToken.None);

        Assert.NotEqual(0, createdId);
        Assert.False(await db.EquipmentItems.AsNoTracking().AnyAsync(x => x.Id == EquipmentItemId));
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
            Description = "Seed"
        });
        db.EquipmentItems.Add(new EquipmentItemEntity
        {
            Id = EquipmentItemId,
            EquipmentId = EquipmentId,
            SerialNumber = "SEED-1",
            IsAvailable = true
        });
        db.SaveChanges();
        return db;
    }

    private static CreateEquipmentItemCommand CreateCommand(string serialNumber) => new()
    {
        EquipmentId = EquipmentId,
        SerialNumber = serialNumber,
        IsAvailable = true
    };

    private static UpdateEquipmentItemCommand UpdateCommand(string serialNumber) => new()
    {
        Id = EquipmentItemId,
        SerialNumber = serialNumber,
        IsAvailable = true
    };

    private static AssignEquipmentItemCommand AssignCommand() => new()
    {
        EquipmentItemId = EquipmentItemId,
        AssignedAtUtc = DateTime.UtcNow,
        ReturnedAtUtc = DateTime.UtcNow.AddDays(1),
        Location = "Desk",
        StudentId = 801,
        EmployeeId = 802
    };

    private static FakeAppCurrentUser Student() => new(803);

    private static FakeAppCurrentUser Employee() => new(804, isEmployee: true);

    private static FakeAppCurrentUser Admin() => new(805, isAdmin: true);
}
