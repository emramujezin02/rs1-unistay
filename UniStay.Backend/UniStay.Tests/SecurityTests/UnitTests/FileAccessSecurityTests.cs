using System.Reflection;
using FluentValidation.TestHelper;
using UniStay.API.Controllers;
using UniStay.Application.Abstractions;
using UniStay.Application.Modules.AccommodationApplications.Queries.DownloadDocument;
using UniStay.Application.Modules.Files.Commands.Upload;
using UniStay.Domain.Entities.Applications;
using UniStay.Domain.Entities.Identity;
using UniStay.Tests.Services;

namespace UniStay.Tests.SecurityTests.UnitTests;

public sealed class FileAccessSecurityTests
{
    [Fact]
    public void Program_DoesNotMapUploadsAsPublicStaticFiles()
    {
        var programPath = LocateProgramCs();
        var source = File.ReadAllText(programPath);

        Assert.DoesNotContain("RequestPath = \"/uploads\"", source, StringComparison.OrdinalIgnoreCase);
        Assert.DoesNotContain("PhysicalFileProvider(uploadsPath)", source, StringComparison.OrdinalIgnoreCase);
    }

    [Theory]
    [InlineData("document.pdf", "%PDF-1.7\n")]
    [InlineData("photo.jpg", "\u00FF\u00D8\u00FF\u00E0")]
    [InlineData("photo.jpeg", "\u00FF\u00D8\u00FF\u00E0")]
    public void UploadValidator_AllowsValidPdfAndJpegSignatures(string fileName, string signature)
    {
        var validator = new UploadFileCommandValidator();
        using var stream = new MemoryStream(signature.Select(ch => (byte)ch).ToArray());

        var result = validator.TestValidate(new UploadFileCommand(stream, fileName, stream.Length));

        result.ShouldNotHaveAnyValidationErrors();
        Assert.Equal(0, stream.Position);
    }

    [Fact]
    public void UploadValidator_AllowsValidPngSignature()
    {
        var validator = new UploadFileCommandValidator();
        using var stream = new MemoryStream([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00]);

        var result = validator.TestValidate(new UploadFileCommand(stream, "image.png", stream.Length));

        result.ShouldNotHaveAnyValidationErrors();
        Assert.Equal(0, stream.Position);
    }

    [Theory]
    [InlineData("malicious.pdf")]
    [InlineData("fake.jpg")]
    [InlineData("fake.png")]
    public void UploadValidator_RejectsSpoofedFileSignatures(string fileName)
    {
        var validator = new UploadFileCommandValidator();
        using var stream = new MemoryStream("not the declared file type"u8.ToArray());

        var result = validator.TestValidate(new UploadFileCommand(stream, fileName, stream.Length));

        result.ShouldHaveValidationErrorFor(x => x);
        Assert.Equal(0, stream.Position);
    }

    [Fact]
    public void UploadValidator_RejectsMismatchedExtensionAndSignature()
    {
        var validator = new UploadFileCommandValidator();
        using var stream = new MemoryStream([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

        var result = validator.TestValidate(new UploadFileCommand(stream, "image.pdf", stream.Length));

        result.ShouldHaveValidationErrorFor(x => x);
    }

    [Fact]
    public void UploadValidator_KeepsMaxFileSizeValidation()
    {
        var validator = new UploadFileCommandValidator();
        using var stream = new MemoryStream("%PDF-1.7\n"u8.ToArray());

        var result = validator.TestValidate(new UploadFileCommand(
            stream,
            "document.pdf",
            UploadFileCommandValidator.MaxFileSizeBytes + 1));

        result.ShouldHaveValidationErrorFor(x => x.Length);
    }

    [Fact]
    public async Task DownloadDocument_AllowsApplicationOwner()
    {
        await using var db = CreateDb();
        var handler = new DownloadApplicationDocumentQueryHandler(
            db,
            new FakeAppCurrentUser(StudentAId),
            new FakeFileStorageService());

        var result = await handler.Handle(
            new DownloadApplicationDocumentQuery(ApplicationAId, "identity.pdf"),
            CancellationToken.None);

        Assert.Equal("identity.pdf", result.FileName);
        Assert.Equal("application/pdf", result.ContentType);
    }

    [Fact]
    public async Task DownloadDocument_AllowsStaff()
    {
        await using var db = CreateDb();
        var handler = new DownloadApplicationDocumentQueryHandler(
            db,
            new FakeAppCurrentUser(StaffId, isEmployee: true),
            new FakeFileStorageService());

        var result = await handler.Handle(
            new DownloadApplicationDocumentQuery(ApplicationAId, "identity.pdf"),
            CancellationToken.None);

        Assert.Equal("identity.pdf", result.FileName);
    }

    [Fact]
    public async Task DownloadDocument_AllowsAdmin()
    {
        await using var db = CreateDb();
        var handler = new DownloadApplicationDocumentQueryHandler(
            db,
            new FakeAppCurrentUser(StaffId, isAdmin: true),
            new FakeFileStorageService());

        var result = await handler.Handle(
            new DownloadApplicationDocumentQuery(ApplicationAId, "identity.pdf"),
            CancellationToken.None);

        Assert.Equal("identity.pdf", result.FileName);
    }

    [Fact]
    public async Task DownloadDocument_BlocksOtherStudent()
    {
        await using var db = CreateDb();
        var storage = new FakeFileStorageService();
        var handler = new DownloadApplicationDocumentQueryHandler(
            db,
            new FakeAppCurrentUser(StudentBId),
            storage);

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            handler.Handle(new DownloadApplicationDocumentQuery(ApplicationAId, "identity.pdf"), CancellationToken.None));
        Assert.False(storage.WasOpened);
    }

    [Fact]
    public async Task DownloadDocument_BlocksAnonymous()
    {
        await using var db = CreateDb();
        var storage = new FakeFileStorageService();
        var handler = new DownloadApplicationDocumentQueryHandler(
            db,
            new FakeAppCurrentUser(),
            storage);

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            handler.Handle(new DownloadApplicationDocumentQuery(ApplicationAId, "identity.pdf"), CancellationToken.None));
        Assert.False(storage.WasOpened);
    }

    [Fact]
    public async Task DownloadDocument_SupportsExistingUploadsUrlReferences()
    {
        await using var db = CreateDb("/uploads/legacy-enrollment.pdf");
        var handler = new DownloadApplicationDocumentQueryHandler(
            db,
            new FakeAppCurrentUser(StudentAId),
            new FakeFileStorageService());

        var result = await handler.Handle(
            new DownloadApplicationDocumentQuery(ApplicationAId, "legacy-enrollment.pdf"),
            CancellationToken.None);

        Assert.Equal("identity.pdf", result.FileName);
    }

    [Fact]
    public void DownloadDocumentEndpoint_IsAuthorizedBackendControllerAction()
    {
        var method = typeof(AccommodationApplicationsController).GetMethod(nameof(AccommodationApplicationsController.DownloadDocument));

        Assert.NotNull(method);
        Assert.DoesNotContain(method!.GetCustomAttributes(typeof(Microsoft.AspNetCore.Authorization.AllowAnonymousAttribute), true), _ => true);
    }

    private const int StudentAId = 501;
    private const int StudentBId = 502;
    private const int StaffId = 503;
    private const int ApplicationAId = 601;

    private static DatabaseContext CreateDb(string fileReference = "identity.pdf")
    {
        var options = new DbContextOptionsBuilder<DatabaseContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        var db = new DatabaseContext(options, TimeProvider.System);
        db.Users.AddRange(
            CreateUser(StudentAId, "student-a@test.com", isEmployee: false),
            CreateUser(StudentBId, "student-b@test.com", isEmployee: false),
            CreateUser(StaffId, "staff@test.com", isEmployee: true));
        db.AccommodationApplications.Add(new AccommodationApplicationEntity
        {
            Id = ApplicationAId,
            StudentId = StudentAId,
            PreferredRoomType = "Single",
            YearOfStudy = 2,
            DocumentNames = $"identity.pdf|{fileReference},enrollment.pdf|enrollment.pdf",
            Status = ApplicationStatusType.Pending,
            AppliedAtUtc = DateTime.UtcNow,
            CreatedAtUtc = DateTime.UtcNow
        });
        db.SaveChanges();
        return db;
    }

    private static UniStayUserEntity CreateUser(int id, string email, bool isEmployee) =>
        new()
        {
            Id = id,
            Email = email,
            Firstname = "Test",
            Lastname = "User",
            Username = email,
            PasswordHash = "hash",
            Phone = "000-000-0000",
            IsStudent = !isEmployee,
            IsEmployee = isEmployee,
            IsEnabled = true,
            CreatedAtUtc = DateTime.UtcNow
        };

    private static string LocateProgramCs()
    {
        var current = new DirectoryInfo(AppContext.BaseDirectory);
        while (current is not null)
        {
            var candidate = Path.Combine(current.FullName, "UniStay.API", "Program.cs");
            if (File.Exists(candidate))
                return candidate;

            current = current.Parent;
        }

        throw new DirectoryNotFoundException("Could not locate UniStay.API Program.cs.");
    }

    private sealed class FakeFileStorageService : IFileStorageService
    {
        public bool WasOpened { get; private set; }

        public Task<StoredFileResult> SaveAsync(Stream content, string originalFileName, CancellationToken cancellationToken) =>
            Task.FromResult(new StoredFileResult(originalFileName, originalFileName));

        public Task<StoredFileReadResult> OpenReadAsync(string fileId, CancellationToken cancellationToken)
        {
            WasOpened = true;
            return Task.FromResult(new StoredFileReadResult(
                new MemoryStream("%PDF-1.7\n"u8.ToArray()),
                fileId,
                "application/pdf"));
        }
    }
}
