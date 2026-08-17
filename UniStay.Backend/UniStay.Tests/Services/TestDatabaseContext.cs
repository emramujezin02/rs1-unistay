using Microsoft.Extensions.Time.Testing;
using UniStay.Domain.Entities.Housing;

namespace UniStay.Tests.Services;

public static class TestDatabaseContext
{
    public static DatabaseContext Create()
    {
        var options = new DbContextOptionsBuilder<DatabaseContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        var db = new DatabaseContext(options, new FakeTimeProvider());

        db.Halls.Add(new HallEntity
        {
            Id = 1,
            Name = "Test Hall",
            Capacity = 100,
            Description = "Seeded test hall",
            IsAvailable = true,
            AvailableFrom = DateTime.UtcNow.Date,
            AvailableTo = DateTime.UtcNow.Date.AddDays(5),
            CreatedAtUtc = DateTime.UtcNow
        });

        db.SaveChanges();

        return db;
    }
}
