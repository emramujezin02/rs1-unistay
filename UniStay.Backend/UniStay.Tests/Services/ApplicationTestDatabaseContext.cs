using Microsoft.Extensions.Time.Testing;
using UniStay.Domain.Entities.Applications;
using UniStay.Domain.Entities.Housing;
using UniStay.Domain.Entities.Identity;
using UniStay.Domain.Entities.Notifications;

namespace UniStay.Tests.Services;

public static class ApplicationTestDatabaseContext
{
    public const int StudentId = 101;
    public const int AdminId = 102;
    public const int ApplicationId = 201;
    public const int HallId = 301;
    public const int RoomId = 302;
    public const int BedId = 303;
    public const int UnreadNotificationId = 401;
    public const int ReadNotificationId = 402;

    public static DatabaseContext Create()
    {
        var options = new DbContextOptionsBuilder<DatabaseContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        var db = new DatabaseContext(options, new FakeTimeProvider());
        var now = DateTime.UtcNow;

        db.Users.AddRange(
            CreateUser(StudentId, "student@test.com", "student", isAdmin: false, now),
            CreateUser(AdminId, "admin@test.com", "admin", isAdmin: true, now));

        db.Notifications.AddRange(
            new NotificationEntity
            {
                Id = UnreadNotificationId,
                UserId = StudentId,
                Title = "Unread notification",
                Message = "Unread message",
                Type = "test.type",
                IsRead = false,
                CreatedAtUtc = now
            },
            new NotificationEntity
            {
                Id = ReadNotificationId,
                UserId = StudentId,
                Title = "Read notification",
                Message = "Read message",
                Type = "test.type",
                IsRead = true,
                CreatedAtUtc = now.AddMinutes(-1)
            });

        db.Halls.Add(new HallEntity
        {
            Id = HallId,
            Name = "Test Hall",
            Capacity = 50,
            AvailableFrom = now.Date,
            AvailableTo = now.Date.AddYears(1),
            IsAvailable = true,
            CreatedAtUtc = now
        });

        db.Rooms.Add(new RoomEntity
        {
            Id = RoomId,
            HallId = HallId,
            RoomNumber = "101",
            MaxOccupancy = 2,
            Floor = 1,
            Description = "Test room",
            CreatedAtUtc = now
        });

        db.Beds.Add(new BedEntity
        {
            Id = BedId,
            RoomId = RoomId,
            BedNumber = "A",
            CreatedAtUtc = now
        });

        db.AccommodationApplications.Add(new AccommodationApplicationEntity
        {
            Id = ApplicationId,
            StudentId = StudentId,
            AppliedAtUtc = now,
            Status = ApplicationStatusType.Pending,
            PreferredRoomType = "Single",
            YearOfStudy = 2,
            CreatedAtUtc = now
        });

        db.SaveChanges();
        return db;
    }

    private static UniStayUserEntity CreateUser(
        int id,
        string email,
        string username,
        bool isAdmin,
        DateTime createdAtUtc) =>
        new()
        {
            Id = id,
            Email = email,
            Firstname = "Test",
            Lastname = isAdmin ? "Admin" : "Student",
            Username = username,
            PasswordHash = "hash",
            Phone = "000-000-0000",
            IsAdmin = isAdmin,
            IsStudent = !isAdmin,
            IsEnabled = true,
            CreatedAtUtc = createdAtUtc
        };
}
