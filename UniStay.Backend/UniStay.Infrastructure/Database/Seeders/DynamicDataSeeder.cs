using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using UniStay.Domain.Entities.Applications;
using UniStay.Domain.Entities.Communication;
using UniStay.Domain.Entities.Housing;
using UniStay.Domain.Entities.Identity;
using UniStay.Domain.Entities.Payments;

namespace UniStay.Infrastructure.Database.Seeders;

public static class DynamicDataSeeder
{
    public static async Task SeedAsync(DatabaseContext context)
    {
        await context.Database.EnsureCreatedAsync();

        await SeedUsersAsync(context);
        await SeedDemoStudentsAsync(context);
        await SeedSecurityQuestionsAsync(context);
        await SeedHallsAsync(context);
        await SeedRoomsAsync(context);
        await SeedFaultsAsync(context);
        await SeedEquipmentAsync(context);
        await SeedBedAssignmentsAsync(context);
        await SeedAnnouncementsAsync(context);
        await SeedInvoicesAsync(context);
        await SeedMessagesAsync(context);
        await SeedEmployeeMessagesAsync(context);
        await SeedAccommodationApplicationsAsync(context);
        await SeedRoomReviewsAsync(context);
        await SeedFavoriteRoomsAsync(context);
    }

    private static async Task SeedSecurityQuestionsAsync(DatabaseContext context)
    {
        if (await context.SecurityQuestions.AnyAsync())
            return;

        context.SecurityQuestions.AddRange(
            new SecurityQuestionEntity { Text = "What was the name of your first school?", CreatedAtUtc = DateTime.UtcNow },
            new SecurityQuestionEntity { Text = "What is your mother's maiden name?", CreatedAtUtc = DateTime.UtcNow },
            new SecurityQuestionEntity { Text = "What was your first pet's name?", CreatedAtUtc = DateTime.UtcNow },
            new SecurityQuestionEntity { Text = "In which city were you born?", CreatedAtUtc = DateTime.UtcNow }
        );

        await context.SaveChangesAsync();
        Console.WriteLine("Dynamic seed: security questions added.");
    }

    private static async Task SeedHallsAsync(DatabaseContext context)
    {
        if (await context.Halls.AnyAsync())
            return;

        context.Halls.AddRange(
            new HallEntity
            {
                Name = "North Hall",
                Capacity = 120,
                Description = "Main student residence hall.",
                AvailableFrom = DateTime.UtcNow.Date,
                AvailableTo = DateTime.UtcNow.Date.AddMonths(6),
                IsAvailable = true,
                CreatedAtUtc = DateTime.UtcNow
            },
            new HallEntity
            {
                Name = "Riverside Hall",
                Capacity = 80,
                Description = "Smaller hall near the study area.",
                AvailableFrom = DateTime.UtcNow.Date.AddDays(7),
                AvailableTo = DateTime.UtcNow.Date.AddMonths(4),
                IsAvailable = true,
                CreatedAtUtc = DateTime.UtcNow
            },
            new HallEntity
            {
                Name = "Old Campus Hall",
                Capacity = 60,
                Description = "Currently under maintenance.",
                AvailableFrom = DateTime.UtcNow.Date.AddMonths(1),
                AvailableTo = DateTime.UtcNow.Date.AddMonths(8),
                IsAvailable = false,
                CreatedAtUtc = DateTime.UtcNow
            }
        );

        await context.SaveChangesAsync();
        Console.WriteLine("Dynamic seed: halls added.");
    }

    private static async Task SeedFaultsAsync(DatabaseContext context)
    {
        if (await context.Faults.AnyAsync())
            return;

        var reporter = await context.Users
            .OrderBy(x => x.Id)
            .FirstOrDefaultAsync();

        if (reporter is null)
        {
            Console.WriteLine("No users found. Skipping faults seed.");
            return;
        }

        var north101 = await context.Rooms
            .FirstOrDefaultAsync(x => x.RoomNumber == "101");
        var riverside204 = await context.Rooms
            .FirstOrDefaultAsync(x => x.RoomNumber == "204");

        if (north101 is null || riverside204 is null)
        {
            Console.WriteLine("Required rooms not found. Skipping faults seed.");
            return;
        }

        context.Faults.AddRange(
            new FaultEntity
            {
                Title = "Heating issue",
                Description = "Radiator is not heating properly.",
                Status = FaultEntity.Statuses.Open,
                Priority = FaultEntity.Priorities.High,
                ReportedAtUtc = DateTime.UtcNow.AddDays(-3),
                IsResolved = false,
                ReportedByUserId = reporter.Id,
                RoomId = north101.Id,
                CreatedAtUtc = DateTime.UtcNow.AddDays(-3)
            },
            new FaultEntity
            {
                Title = "Broken desk lamp",
                Description = "Desk lamp needs replacement.",
                Status = FaultEntity.Statuses.Resolved,
                Priority = FaultEntity.Priorities.Low,
                ReportedAtUtc = DateTime.UtcNow.AddDays(-10),
                ResolvedAtUtc = DateTime.UtcNow.AddDays(-8),
                IsResolved = true,
                ReportedByUserId = reporter.Id,
                RoomId = riverside204.Id,
                CreatedAtUtc = DateTime.UtcNow.AddDays(-10)
            }
        );

        await context.SaveChangesAsync();
        Console.WriteLine("Dynamic seed: faults added.");
    }

    private static async Task SeedRoomsAsync(DatabaseContext context)
    {
        if (await context.Rooms.AnyAsync())
            return;

        var north101 = new RoomEntity
        {
            RoomNumber = "101",
            Floor = 1,
            MaxOccupancy = 2,
            Description = "Double room near the common study area.",
            Building = "North Hall",
            RoomSide = "East",
            NearExit = true,
            WheelchairAccessible = false,
            ElevatorAccess = true,
            CreatedAtUtc = DateTime.UtcNow
        };

        north101.Beds.Add(new BedEntity { BedNumber = "101-1", CreatedAtUtc = DateTime.UtcNow });
        north101.Beds.Add(new BedEntity { BedNumber = "101-2", CreatedAtUtc = DateTime.UtcNow });

        north101.Images.Add(new RoomImageEntity { ImageUrl = "rooms/room_1_1.jpg", CreatedAtUtc = DateTime.UtcNow });
        north101.Images.Add(new RoomImageEntity { ImageUrl = "rooms/room_1_2.jpg", CreatedAtUtc = DateTime.UtcNow });
        north101.Images.Add(new RoomImageEntity { ImageUrl = "rooms/room_1_3.jpg", CreatedAtUtc = DateTime.UtcNow });
        north101.Images.Add(new RoomImageEntity { ImageUrl = "rooms/room_1_4.jpg", CreatedAtUtc = DateTime.UtcNow });

        var riverside204 = new RoomEntity
        {
            RoomNumber = "204",
            Floor = 2,
            MaxOccupancy = 1,
            Description = "Single room with a quiet courtyard view.",
            Building = "Riverside Hall",
            RoomSide = "West",
            NearExit = false,
            WheelchairAccessible = true,
            ElevatorAccess = true,
            CreatedAtUtc = DateTime.UtcNow,
        };

        riverside204.Images.Add(new RoomImageEntity { ImageUrl = "rooms/room_2_1.jpg", CreatedAtUtc = DateTime.UtcNow });
        riverside204.Images.Add(new RoomImageEntity { ImageUrl = "rooms/room_2_2.jpg", CreatedAtUtc = DateTime.UtcNow });
        riverside204.Images.Add(new RoomImageEntity { ImageUrl = "rooms/room_2_3.jpg", CreatedAtUtc = DateTime.UtcNow });
        riverside204.Images.Add(new RoomImageEntity { ImageUrl = "rooms/room_2_4.jpg", CreatedAtUtc = DateTime.UtcNow });

        riverside204.Beds.Add(new BedEntity { BedNumber = "204-1", CreatedAtUtc = DateTime.UtcNow });

        context.Rooms.AddRange(north101, riverside204);
        await context.SaveChangesAsync();

        Console.WriteLine("Dynamic seed: rooms and beds added.");
    }


    private static async Task SeedEquipmentAsync(DatabaseContext context)
    {
        if (await context.Equipment.AnyAsync())
            return;

        var projector = new EquipmentEntity
        {
            Name = "Projector",
            Description = "Portable classroom projector.",
            RentalPrice = "15",
            EquipmentType = "Electronics",
            CreatedAtUtc = DateTime.UtcNow
        };

        projector.Items.Add(new EquipmentItemEntity
        {
            SerialNumber = "Projector-1",
            IsAvailable = true,
            CreatedAtUtc = DateTime.UtcNow
        });

        projector.Items.Add(new EquipmentItemEntity
        {
            SerialNumber = "Projector-2",
            IsAvailable = false,
            AssignedAtUtc = DateTime.UtcNow.AddDays(-2),
            ReturnedAtUtc = DateTime.UtcNow.AddDays(3),
            Location = "Study room A",
            CreatedAtUtc = DateTime.UtcNow.AddDays(-2)
        });

        var chair = new EquipmentEntity
        {
            Name = "Folding Chair",
            Description = "Extra chair for events.",
            RentalPrice = "2",
            EquipmentType = "Furniture",
            CreatedAtUtc = DateTime.UtcNow
        };

        chair.Items.Add(new EquipmentItemEntity
        {
            SerialNumber = "Folding Chair-1",
            IsAvailable = true,
            CreatedAtUtc = DateTime.UtcNow
        });

        chair.Items.Add(new EquipmentItemEntity
        {
            SerialNumber = "Folding Chair-2",
            IsAvailable = true,
            CreatedAtUtc = DateTime.UtcNow
        });

        context.Equipment.AddRange(projector, chair);
        await context.SaveChangesAsync();

        Console.WriteLine("Dynamic seed: equipment added.");
    }

    private static async Task SeedDemoStudentsAsync(DatabaseContext context)
    {
        if (await context.Users.AnyAsync(x => x.IsStudent))
            return;

        var hasher = new PasswordHasher<UniStayUserEntity>();
        var students = new List<UniStayUserEntity>();
        var names = new (string First, string Last)[]
        {
            ("Ammar", "Hopovac"),
            ("Lena", "Petrovic"),
            ("Marko", "Jovic"),
            ("Ana", "Simic"),
            ("Ivan", "Nikolic"),
            ("Sara", "Djordjevic"),
            ("Nikola", "Stojanovic"),
            ("Milica", "Ilic")
        };

        for (var i = 0; i < names.Length; i++)
        {
            var email = i == 0 ? "ammar.hopovac@edu.fit.ba" : $"student{i}@edu.fit.ba";
            if (await context.Users.AnyAsync(x => x.Email == email))
                continue;

            var username = i == 0 ? "ammar.hopovac" : $"student{i}";
            var student = new UniStayUserEntity
            {
                Firstname = names[i].First,
                Lastname = names[i].Last,
                Email = email,
                Username = username,
                Phone = string.Empty,
                PasswordHash = hasher.HashPassword(null!, "Student123!"),
                IsStudent = true,
                IsEnabled = true,
                CreatedAtUtc = DateTime.UtcNow
            };

            students.Add(student);
        }

        if (students.Count == 0)
            return;

        context.Users.AddRange(students);
        await context.SaveChangesAsync();
        Console.WriteLine("Dynamic seed: demo students added.");
    }

    private static async Task SeedBedAssignmentsAsync(DatabaseContext context)
    {
        if (await context.BedAssignments.AnyAsync())
            return;

        var students = await context.Users
            .Where(x => x.IsStudent)
            .OrderBy(x => x.Id)
            .ToListAsync();

        var beds = await context.Beds
            .OrderBy(x => x.Id)
            .ToListAsync();

        if (students.Count == 0 || beds.Count == 0)
            return;

        var from = new DateTime(2025, 9, 1, 0, 0, 0, DateTimeKind.Utc);
        var to = new DateTime(2026, 6, 30, 0, 0, 0, DateTimeKind.Utc);
        var count = Math.Min(students.Count, beds.Count);

        var assignments = Enumerable.Range(0, count)
            .Select(i => new BedAssignmentEntity
            {
                BedId = beds[i].Id,
                StudentId = students[i].Id,
                FromDate = from,
                ToDate = to,
                CreatedAtUtc = DateTime.UtcNow
            })
            .ToList();

        context.BedAssignments.AddRange(assignments);
        await context.SaveChangesAsync();
        Console.WriteLine("Dynamic seed: bed assignments added.");
    }

    private static async Task SeedAnnouncementsAsync(DatabaseContext context)
    {
        if (await context.Announcements.AnyAsync())
            return;

        var author = await context.Users
            .OrderByDescending(x => x.IsAdmin)
            .ThenBy(x => x.Id)
            .FirstOrDefaultAsync();

        if (author is null)
            return;

        context.Announcements.AddRange(
            new AnnouncementEntity
            {
                Title = "Welcome to UniStay",
                Content = "The new semester accommodation cycle is open. Please review your room details and invoices.",
                Audience = AnnouncementEntity.Audiences.Everyone,
                CreatedByUserId = author.Id,
                ExpiresAtUtc = DateTime.UtcNow.AddMonths(2),
                CreatedAtUtc = DateTime.UtcNow.AddDays(-10)
            },
            new AnnouncementEntity
            {
                Title = "Maintenance window",
                Content = "Routine maintenance will be performed in common areas this Friday from 09:00 to 13:00.",
                Audience = AnnouncementEntity.Audiences.StudentsAndEmployees,
                CreatedByUserId = author.Id,
                ExpiresAtUtc = DateTime.UtcNow.AddDays(14),
                CreatedAtUtc = DateTime.UtcNow.AddDays(-4)
            },
            new AnnouncementEntity
            {
                Title = "Invoice reminder",
                Content = "Students with unpaid invoices should complete payment before the end of the month.",
                Audience = AnnouncementEntity.Audiences.Students,
                CreatedByUserId = author.Id,
                ExpiresAtUtc = DateTime.UtcNow.AddDays(30),
                CreatedAtUtc = DateTime.UtcNow.AddDays(-2)
            }
        );

        await context.SaveChangesAsync();
        Console.WriteLine("Dynamic seed: announcements added.");
    }

    private static async Task SeedInvoicesAsync(DatabaseContext context)
    {
        if (await context.Invoices.AnyAsync())
            return;

        var students = await context.Users
            .Where(x => x.IsStudent)
            .OrderBy(x => x.Id)
            .ToListAsync();

        if (students.Count == 0)
            return;

        var invoices = students.Take(6).Select((student, index) => new InvoiceEntity
        {
            StudentId = student.Id,
            TotalAmount = 250m + (index % 3) * 50m,
            IssuedAt = true,
            Paid = index % 3 != 2,
            EmailSent = true,
            CreatedAtUtc = DateTime.UtcNow.AddMonths(-2).AddDays(index)
        }).ToList();

        var primaryStudent = students.FirstOrDefault(x => x.Email == "ammar.hopovac@edu.fit.ba");
        if (primaryStudent is not null && invoices.All(x => x.StudentId != primaryStudent.Id || x.Paid))
        {
            invoices.Add(new InvoiceEntity
            {
                StudentId = primaryStudent.Id,
                TotalAmount = 350m,
                IssuedAt = true,
                Paid = false,
                EmailSent = true,
                CreatedAtUtc = DateTime.UtcNow.AddDays(-5)
            });
        }

        context.Invoices.AddRange(invoices);
        await context.SaveChangesAsync();
        Console.WriteLine("Dynamic seed: invoices added.");
    }

    private static async Task SeedMessagesAsync(DatabaseContext context)
    {
        if (await context.Messages.AnyAsync())
            return;

        var admin = await context.Users
            .OrderByDescending(x => x.IsAdmin)
            .ThenBy(x => x.Id)
            .FirstOrDefaultAsync();

        var students = await context.Users
            .Where(x => x.IsStudent)
            .OrderBy(x => x.Id)
            .ToListAsync();

        if (admin is null || students.Count == 0)
            return;

        var now = DateTime.UtcNow;
        var messages = new List<MessageEntity>
        {
            new()
            {
                SenderUserId = students[0].Id,
                ReceiverUserId = admin.Id,
                Subject = "Window latch repair follow-up",
                MessageText = "Hello, could you please let me know when maintenance will visit my room?",
                SentAtUtc = now.AddDays(-10),
                IsRead = true,
                CreatedAtUtc = now.AddDays(-10)
            },
            new()
            {
                SenderUserId = admin.Id,
                ReceiverUserId = students[0].Id,
                Subject = "Re: Window latch repair follow-up",
                MessageText = "Hi, maintenance is scheduled to visit your room within the next 48 hours.",
                SentAtUtc = now.AddDays(-9),
                IsRead = true,
                CreatedAtUtc = now.AddDays(-9)
            }
        };

        if (students.Count > 1)
        {
            messages.Add(new MessageEntity
            {
                SenderUserId = students[1].Id,
                ReceiverUserId = admin.Id,
                Subject = "Invoice amount query",
                MessageText = "My invoice shows an extra equipment rental fee. Could you clarify it?",
                SentAtUtc = now.AddDays(-5),
                IsRead = false,
                CreatedAtUtc = now.AddDays(-5)
            });
        }

        context.Messages.AddRange(messages);
        await context.SaveChangesAsync();
        Console.WriteLine("Dynamic seed: messages added.");
    }

    private static async Task SeedEmployeeMessagesAsync(DatabaseContext context)
    {
        var employee = await context.Users
            .Where(x => x.IsEmployee)
            .OrderBy(x => x.Id)
            .FirstOrDefaultAsync();

        if (employee is null)
            return;

        var hasEmployeeConversation = await context.Messages
            .AnyAsync(x => x.SenderUserId == employee.Id || x.ReceiverUserId == employee.Id);

        if (hasEmployeeConversation)
            return;

        var student = await context.Users
            .Where(x => x.IsStudent)
            .OrderBy(x => x.Id)
            .FirstOrDefaultAsync();

        if (student is null)
            return;

        var now = DateTime.UtcNow;
        context.Messages.AddRange(
            new MessageEntity
            {
                SenderUserId = student.Id,
                ReceiverUserId = employee.Id,
                Subject = "Heating issue follow-up",
                MessageText = "Hi, my room heating fault is still open. Is there any update from maintenance?",
                SentAtUtc = now.AddDays(-3),
                IsRead = true,
                CreatedAtUtc = now.AddDays(-3)
            },
            new MessageEntity
            {
                SenderUserId = employee.Id,
                ReceiverUserId = student.Id,
                Subject = "Re: Heating issue follow-up",
                MessageText = "Hello, the replacement part has arrived and maintenance will visit your room tomorrow morning.",
                SentAtUtc = now.AddDays(-2),
                IsRead = true,
                CreatedAtUtc = now.AddDays(-2)
            },
            new MessageEntity
            {
                SenderUserId = student.Id,
                ReceiverUserId = employee.Id,
                Subject = "Re: Heating issue follow-up",
                MessageText = "Thank you, tomorrow morning works for me.",
                SentAtUtc = now.AddDays(-1),
                IsRead = false,
                CreatedAtUtc = now.AddDays(-1)
            });

        await context.SaveChangesAsync();
        Console.WriteLine("Dynamic seed: employee messages added.");
    }

    private static async Task SeedAccommodationApplicationsAsync(DatabaseContext context)
    {
        if (await context.AccommodationApplications.AnyAsync())
            return;

        var reviewer = await context.Users
            .OrderByDescending(x => x.IsAdmin)
            .ThenBy(x => x.Id)
            .FirstOrDefaultAsync();

        var students = await context.Users
            .Where(x => x.IsStudent)
            .OrderBy(x => x.Id)
            .ToListAsync();

        var rooms = await context.Rooms
            .OrderBy(x => x.Id)
            .ToListAsync();

        if (students.Count == 0 || rooms.Count == 0)
            return;

        var now = DateTime.UtcNow;
        var applications = students.Take(6).Select((student, index) =>
        {
            var approved = index < 2;
            var rejected = index == 2;

            return new AccommodationApplicationEntity
            {
                StudentId = student.Id,
                AppliedAtUtc = now.AddDays(-30 + index),
                DecisionAtUtc = approved || rejected ? now.AddDays(-20 + index) : null,
                PreferredRoomType = index % 2 == 0 ? "Single" : "Double",
                PreferredRoomId = rooms[index % rooms.Count].Id,
                YearOfStudy = 1 + index % 4,
                GpaScore = 7.5m + index * 0.25m,
                PhoneNumber = $"+38761000{index:000}",
                Notes = index % 2 == 0 ? "Prefer a quiet room near the study area." : null,
                Status = approved
                    ? ApplicationStatusType.Approved
                    : rejected ? ApplicationStatusType.Rejected : ApplicationStatusType.Pending,
                AssignedRoomId = approved ? rooms[index % rooms.Count].Id : null,
                DecisionByUserId = approved || rejected ? reviewer?.Id : null,
                CreatedAtUtc = now.AddDays(-30 + index)
            };
        }).ToList();

        context.AccommodationApplications.AddRange(applications);
        await context.SaveChangesAsync();
        Console.WriteLine("Dynamic seed: accommodation applications added.");
    }

    private static async Task SeedRoomReviewsAsync(DatabaseContext context)
    {
        if (await context.RoomReviews.AnyAsync())
            return;

        var rooms = await context.Rooms
            .OrderBy(x => x.Id)
            .ToListAsync();

        var students = await context.Users
            .Where(x => x.IsStudent)
            .OrderBy(x => x.Id)
            .ToListAsync();

        if (rooms.Count == 0 || students.Count == 0)
            return;

        var count = Math.Min(rooms.Count, students.Count);
        var comments = new[]
        {
            "Clean and well-maintained room with a comfortable study setup.",
            "Good location and quiet enough for evening study.",
            "Solid room overall. Maintenance responded quickly when needed."
        };

        var reviews = Enumerable.Range(0, count).Select(i => new RoomReviewEntity
        {
            RoomId = rooms[i].Id,
            UserId = students[i].Id,
            Rating = 5 - i % 3,
            Comment = comments[i % comments.Length],
            CreatedAtUtc = DateTime.UtcNow.AddDays(-20 + i)
        }).ToList();

        context.RoomReviews.AddRange(reviews);
        await context.SaveChangesAsync();
        Console.WriteLine("Dynamic seed: room reviews added.");
    }

    private static async Task SeedFavoriteRoomsAsync(DatabaseContext context)
    {
        if (await context.FavoriteRooms.AnyAsync())
            return;

        var rooms = await context.Rooms
            .OrderBy(x => x.Id)
            .ToListAsync();

        var students = await context.Users
            .Where(x => x.IsStudent)
            .OrderBy(x => x.Id)
            .ToListAsync();

        if (rooms.Count == 0 || students.Count == 0)
            return;

        var favorites = students.Take(4).Select((student, index) => new FavoriteRoomEntity
        {
            UserId = student.Id,
            RoomId = rooms[index % rooms.Count].Id,
            CreatedAtUtc = DateTime.UtcNow
        }).ToList();

        context.FavoriteRooms.AddRange(favorites);
        await context.SaveChangesAsync();
        Console.WriteLine("Dynamic seed: favorite rooms added.");
    }

    private static async Task SeedUsersAsync(DatabaseContext context)
    {
        if (await context.Users.AnyAsync())
            return;

        var hasher = new PasswordHasher<UniStayUserEntity>();

        var admin = new UniStayUserEntity
        {
            Firstname = "System",
            Lastname = "Admin",
            Email = "admin@unistay.ba",
            Username = "admin",
            PasswordHash = hasher.HashPassword(null!, "Admin123!"),
            IsAdmin = true,
            IsEnabled = true,
            CreatedAtUtc = DateTime.UtcNow
        };

        var manager = new UniStayUserEntity
        {
            Firstname = "Residence",
            Lastname = "Manager",
            Email = "manager@unistay.local",
            Username = "manager",
            PasswordHash = hasher.HashPassword(null!, "Manager123!"),
            IsManager = true,
            IsEnabled = true,
            CreatedAtUtc = DateTime.UtcNow
        };

        var employee = new UniStayUserEntity
        {
            Firstname = "Front",
            Lastname = "Desk",
            Email = "employee@unistay.ba",
            Username = "employee",
            PasswordHash = hasher.HashPassword(null!, "Employee123!"),
            IsEmployee = true,
            IsEnabled = true,
            CreatedAtUtc = DateTime.UtcNow
        };

        var student = new UniStayUserEntity
        {
            Firstname = "Student",
            Lastname = "One",
            Email = "student@unistay.ba",
            Username = "student",
            PasswordHash = hasher.HashPassword(null!, "Student123!"),
            IsEnabled = true,
            IsStudent=true,
            CreatedAtUtc = DateTime.UtcNow
        };

        context.Users.AddRange(admin, manager, employee, student);

        await context.SaveChangesAsync();
        Console.WriteLine("Dynamic seed: demo users added.");
    }
}
