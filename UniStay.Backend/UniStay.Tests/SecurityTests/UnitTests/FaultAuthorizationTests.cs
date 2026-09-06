using Microsoft.Extensions.Time.Testing;
using UniStay.Application.Modules.Housing.Faults.Commands.Delete;
using UniStay.Application.Modules.Housing.Faults.Commands.Update;
using UniStay.Domain.Entities.Housing;
using UniStay.Domain.Entities.Identity;
using UniStay.Tests.Services;

namespace UniStay.Tests.SecurityTests.UnitTests;

public class FaultAuthorizationTests
{
    private const int StudentAId = 201;
    private const int StudentBId = 202;
    private const int EmployeeId = 203;
    private const int FaultId = 301;
    private const int RoomId = 302;

    [Fact]
    public async Task Update_Should_Reject_Student_For_Another_Users_Fault()
    {
        await using var db = CreateDb();
        var handler = new UpdateFaultCommandHandler(db, StudentA(), TimeProvider.System);

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            handler.Handle(UpdateCommand("Changed by wrong student"), CancellationToken.None));

        var fault = await db.Faults.AsNoTracking().SingleAsync(x => x.Id == FaultId);
        Assert.Equal("Original fault", fault.Title);
    }

    [Fact]
    public async Task Delete_Should_Reject_Student_For_Another_Users_Fault()
    {
        await using var db = CreateDb();
        var handler = new DeleteFaultCommandHandler(db, StudentA());

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            handler.Handle(new DeleteFaultCommand { Id = FaultId }, CancellationToken.None));

        Assert.True(await db.Faults.AsNoTracking().AnyAsync(x => x.Id == FaultId));
    }

    [Fact]
    public async Task Update_Should_Allow_Fault_Owner()
    {
        await using var db = CreateDb();
        var handler = new UpdateFaultCommandHandler(db, StudentB(), TimeProvider.System);

        await handler.Handle(UpdateCommand("Owner changed fault"), CancellationToken.None);

        var fault = await db.Faults.AsNoTracking().SingleAsync(x => x.Id == FaultId);
        Assert.Equal("Owner changed fault", fault.Title);
    }

    [Fact]
    public async Task Delete_Should_Allow_Fault_Owner()
    {
        await using var db = CreateDb();
        var handler = new DeleteFaultCommandHandler(db, StudentB());

        await handler.Handle(new DeleteFaultCommand { Id = FaultId }, CancellationToken.None);

        Assert.False(await db.Faults.AsNoTracking().AnyAsync(x => x.Id == FaultId));
    }

    [Fact]
    public async Task Update_Should_Allow_Employee_For_Any_Fault()
    {
        await using var db = CreateDb();
        var handler = new UpdateFaultCommandHandler(db, Employee(), TimeProvider.System);

        await handler.Handle(UpdateCommand("Employee changed fault"), CancellationToken.None);

        var fault = await db.Faults.AsNoTracking().SingleAsync(x => x.Id == FaultId);
        Assert.Equal("Employee changed fault", fault.Title);
    }

    [Fact]
    public async Task Update_Should_Ignore_Client_Supplied_ResolvedAtUtc()
    {
        var serverNow = DateTimeOffset.Parse("2026-09-04T12:00:00Z");
        var clientDate = DateTime.Parse("1999-01-01T00:00:00Z").ToUniversalTime();
        var clock = new FakeTimeProvider(serverNow);
        await using var db = CreateDb();
        var handler = new UpdateFaultCommandHandler(db, StudentB(), clock);

        var command = UpdateCommand("Resolved by owner");
        command.IsResolved = true;
        command.Status = FaultEntity.Statuses.Resolved;
        command.ResolvedAtUtc = clientDate;

        await handler.Handle(command, CancellationToken.None);

        var fault = await db.Faults.AsNoTracking().SingleAsync(x => x.Id == FaultId);
        Assert.Equal(serverNow.UtcDateTime, fault.ResolvedAtUtc);
        Assert.NotEqual(clientDate, fault.ResolvedAtUtc);
    }

    [Fact]
    public async Task Update_Should_Set_Server_Timestamp_When_Fault_Becomes_Resolved()
    {
        var serverNow = DateTimeOffset.Parse("2026-09-04T12:30:00Z");
        var clock = new FakeTimeProvider(serverNow);
        await using var db = CreateDb();
        var handler = new UpdateFaultCommandHandler(db, Employee(), clock);

        var command = UpdateCommand("Resolved by employee");
        command.IsResolved = true;
        command.Status = FaultEntity.Statuses.Resolved;

        await handler.Handle(command, CancellationToken.None);

        var fault = await db.Faults.AsNoTracking().SingleAsync(x => x.Id == FaultId);
        Assert.True(fault.IsResolved);
        Assert.Equal(serverNow.UtcDateTime, fault.ResolvedAtUtc);
    }

    [Fact]
    public async Task Update_Should_Preserve_Existing_Resolved_Timestamp_When_Already_Resolved()
    {
        var originalResolvedAt = DateTime.Parse("2026-09-01T08:00:00Z").ToUniversalTime();
        await using var db = CreateDb(isResolved: true, resolvedAtUtc: originalResolvedAt);
        var handler = new UpdateFaultCommandHandler(
            db,
            Employee(),
            new FakeTimeProvider(DateTimeOffset.Parse("2026-09-04T12:30:00Z")));

        var command = UpdateCommand("Resolved title edit");
        command.IsResolved = true;
        command.Status = FaultEntity.Statuses.Resolved;

        await handler.Handle(command, CancellationToken.None);

        var fault = await db.Faults.AsNoTracking().SingleAsync(x => x.Id == FaultId);
        Assert.Equal(originalResolvedAt, fault.ResolvedAtUtc);
    }

    private static DatabaseContext CreateDb(bool isResolved = false, DateTime? resolvedAtUtc = null)
    {
        var options = new DbContextOptionsBuilder<DatabaseContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        var db = new DatabaseContext(options, TimeProvider.System);
        db.Users.AddRange(
            User(StudentAId, "student.a@test.com", isStudent: true),
            User(StudentBId, "student.b@test.com", isStudent: true),
            User(EmployeeId, "employee@test.com", isEmployee: true));

        db.Halls.Add(new HallEntity
        {
            Id = 401,
            Name = "Fault Hall",
            Capacity = 10,
            AvailableFrom = DateTime.UtcNow.Date,
            AvailableTo = DateTime.UtcNow.Date.AddDays(30),
            IsAvailable = true
        });

        db.Rooms.Add(new RoomEntity
        {
            Id = RoomId,
            HallId = 401,
            RoomNumber = "F-1",
            MaxOccupancy = 2
        });

        db.Faults.Add(new FaultEntity
        {
            Id = FaultId,
            Title = "Original fault",
            Description = "Original description",
            Status = isResolved ? FaultEntity.Statuses.Resolved : FaultEntity.Statuses.Open,
            IsResolved = isResolved,
            ResolvedAtUtc = resolvedAtUtc,
            ReportedAtUtc = DateTime.UtcNow,
            ReportedByUserId = StudentBId,
            RoomId = RoomId
        });

        db.SaveChanges();
        return db;
    }

    private static UpdateFaultCommand UpdateCommand(string title) => new()
    {
        Id = FaultId,
        Title = title,
        Description = "Updated description",
        Status = FaultEntity.Statuses.Open,
        Priority = FaultEntity.Priorities.Medium,
        IsResolved = false,
        ResolvedAtUtc = DateTime.UtcNow.AddYears(-10)
    };

    private static FakeAppCurrentUser StudentA() => new(StudentAId);

    private static FakeAppCurrentUser StudentB() => new(StudentBId);

    private static FakeAppCurrentUser Employee() => new(EmployeeId, isEmployee: true);

    private static UniStayUserEntity User(int id, string email, bool isStudent = false, bool isEmployee = false) => new()
    {
        Id = id,
        Email = email,
        Username = email,
        Firstname = "Test",
        Lastname = "User",
        Phone = "000",
        PasswordHash = "hash",
        IsEnabled = true,
        IsStudent = isStudent,
        IsEmployee = isEmployee
    };
}
