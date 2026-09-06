using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Time.Testing;
using UniStay.Application.Abstractions;
using UniStay.Application.Common.Exceptions;
using UniStay.Application.Modules.Account.TwoFactor.Commands.Disable;
using UniStay.Application.Modules.Account.TwoFactor.Commands.Enable;
using UniStay.Application.Modules.Account.TwoFactor.Commands.Verify;
using UniStay.Application.Modules.Auth.Commands.Login;
using UniStay.Domain.Entities.Identity;
using UniStay.Shared.Options;
using UniStay.Tests.Services;

namespace UniStay.Tests.TwoFactorTests.UnitTests;

public sealed class TwoFactorSecurityTests
{
    private const int StudentId = 101;
    private const int AdminId = 102;
    private const string Password = "Pass123!";

    [Fact]
    public async Task Enable_Uses_Current_User_And_Does_Not_Target_Request_UserId()
    {
        await using var db = CreateDb();
        var handler = new EnableTwoFactorCommandHandler(db, new FakeSecurityTokenService(), TimeProvider.System, new FakeAppCurrentUser(StudentId));

        var result = await handler.Handle(new EnableTwoFactorCommand(), CancellationToken.None);

        Assert.Equal(8, result.BackupCodes.Count);
        Assert.True(await db.TwoFactorSettings.AnyAsync(x => x.UserId == StudentId && x.IsEnabled));
        Assert.False(await db.TwoFactorSettings.AnyAsync(x => x.UserId == AdminId));
        Assert.Equal(8, await db.BackupCodes.CountAsync(x => x.UserId == StudentId));
        Assert.Equal(0, await db.BackupCodes.CountAsync(x => x.UserId == AdminId));
    }

    [Fact]
    public async Task Disable_Uses_Current_User_Only()
    {
        await using var db = CreateDb();
        db.TwoFactorSettings.AddRange(
            new TwoFactorSettingEntity { UserId = StudentId, IsEnabled = true, RequiresTwoFactor = true },
            new TwoFactorSettingEntity { UserId = AdminId, IsEnabled = true, RequiresTwoFactor = true });
        await db.SaveChangesAsync();

        var handler = new DisableTwoFactorCommandHandler(db, new FakeAppCurrentUser(StudentId));

        await handler.Handle(new DisableTwoFactorCommand(), CancellationToken.None);

        Assert.False((await db.TwoFactorSettings.SingleAsync(x => x.UserId == StudentId)).IsEnabled);
        Assert.True((await db.TwoFactorSettings.SingleAsync(x => x.UserId == AdminId)).IsEnabled);
    }

    [Fact]
    public async Task Verify_Rejects_Direct_Or_Random_Challenge()
    {
        await using var db = CreateDb();
        var handler = CreateVerifyHandler(db);

        await Assert.ThrowsAsync<UniStayConflictException>(() =>
            handler.Handle(new VerifyTwoFactorCommand { ChallengeId = AdminId.ToString(), Code = "ADMINBACKUP" }, CancellationToken.None));
    }

    [Fact]
    public async Task Valid_Login_Challenge_And_Code_Issues_Tokens_For_Challenge_User()
    {
        await using var db = CreateDb();
        EnableTwoFactor(db, StudentId);
        var login = CreateLoginHandler(db);

        var pending = await login.Handle(new LoginCommand { Email = "student@test.com", Password = Password }, CancellationToken.None);
        var verified = await CreateVerifyHandler(db).Handle(
            new VerifyTwoFactorCommand { ChallengeId = pending.TwoFactorChallengeId!, Code = "123456" },
            CancellationToken.None);

        Assert.True(pending.RequiresTwoFactor);
        Assert.False(string.IsNullOrWhiteSpace(pending.TwoFactorChallengeId));
        Assert.Equal(StudentId, verified.UserId);
        Assert.Equal("access-101", verified.AccessToken);
        Assert.Equal("refresh-101", verified.RefreshToken);
    }

    [Fact]
    public async Task Challenge_Cannot_Be_Used_To_Verify_Another_Users_Backup_Code()
    {
        await using var db = CreateDb();
        EnableTwoFactor(db, StudentId);
        db.BackupCodes.AddRange(
            new BackupCodeEntity { UserId = StudentId, CodeHash = "hash:STUDENTBACKUP" },
            new BackupCodeEntity { UserId = AdminId, CodeHash = "hash:ADMINBACKUP" });
        await db.SaveChangesAsync();

        var pending = await CreateLoginHandler(db).Handle(
            new LoginCommand { Email = "student@test.com", Password = Password },
            CancellationToken.None);

        await Assert.ThrowsAsync<UniStayConflictException>(() =>
            CreateVerifyHandler(db).Handle(
                new VerifyTwoFactorCommand { ChallengeId = pending.TwoFactorChallengeId!, Code = "ADMINBACKUP" },
                CancellationToken.None));

        var verified = await CreateVerifyHandler(db).Handle(
            new VerifyTwoFactorCommand { ChallengeId = pending.TwoFactorChallengeId!, Code = "STUDENTBACKUP" },
            CancellationToken.None);

        Assert.Equal(StudentId, verified.UserId);
        Assert.True((await db.BackupCodes.SingleAsync(x => x.UserId == StudentId)).Used);
        Assert.False((await db.BackupCodes.SingleAsync(x => x.UserId == AdminId)).Used);
    }

    [Fact]
    public async Task Verify_Stops_After_Attempt_Limit()
    {
        await using var db = CreateDb();
        EnableTwoFactor(db, StudentId);
        var pending = await CreateLoginHandler(db, options: new TwoFactorOptions { MaxVerifyAttempts = 2 }).Handle(
            new LoginCommand { Email = "student@test.com", Password = Password },
            CancellationToken.None);
        var verify = CreateVerifyHandler(db);

        await Assert.ThrowsAsync<UniStayConflictException>(() =>
            verify.Handle(new VerifyTwoFactorCommand { ChallengeId = pending.TwoFactorChallengeId!, Code = "000000" }, CancellationToken.None));
        await Assert.ThrowsAsync<UniStayConflictException>(() =>
            verify.Handle(new VerifyTwoFactorCommand { ChallengeId = pending.TwoFactorChallengeId!, Code = "111111" }, CancellationToken.None));
        await Assert.ThrowsAsync<UniStayConflictException>(() =>
            verify.Handle(new VerifyTwoFactorCommand { ChallengeId = pending.TwoFactorChallengeId!, Code = "123456" }, CancellationToken.None));

        var challenge = await db.TwoFactorLoginChallenges.SingleAsync();
        Assert.True(challenge.Consumed);
        Assert.Equal(2, challenge.FailedAttempts);
        Assert.Empty(db.RefreshTokens);
    }

    [Fact]
    public async Task Expired_And_Consumed_Challenges_Are_Rejected()
    {
        var clock = new FakeTimeProvider(DateTimeOffset.Parse("2026-01-01T00:00:00Z"));
        await using var db = CreateDb(clock);
        EnableTwoFactor(db, StudentId);
        var pending = await CreateLoginHandler(db, timeProvider: clock, options: new TwoFactorOptions { ChallengeMinutes = 1 }).Handle(
            new LoginCommand { Email = "student@test.com", Password = Password },
            CancellationToken.None);

        clock.Advance(TimeSpan.FromMinutes(2));
        await Assert.ThrowsAsync<UniStayConflictException>(() =>
            CreateVerifyHandler(db, clock).Handle(
                new VerifyTwoFactorCommand { ChallengeId = pending.TwoFactorChallengeId!, Code = "123456" },
                CancellationToken.None));

        await using var replayDb = CreateDb();
        EnableTwoFactor(replayDb, StudentId);
        var replayPending = await CreateLoginHandler(replayDb).Handle(
            new LoginCommand { Email = "student@test.com", Password = Password },
            CancellationToken.None);
        var replayVerify = CreateVerifyHandler(replayDb);

        await replayVerify.Handle(new VerifyTwoFactorCommand { ChallengeId = replayPending.TwoFactorChallengeId!, Code = "123456" }, CancellationToken.None);
        await Assert.ThrowsAsync<UniStayConflictException>(() =>
            replayVerify.Handle(new VerifyTwoFactorCommand { ChallengeId = replayPending.TwoFactorChallengeId!, Code = "123456" }, CancellationToken.None));
    }

    [Fact]
    public async Task Login_Uses_TwoFactorSettings_As_Source_Of_Truth()
    {
        await using var disabledDb = CreateDb();
        disabledDb.Users.Single(x => x.Id == StudentId).Email = "admin@unistay.ba";
        await disabledDb.SaveChangesAsync();

        var disabled = await CreateLoginHandler(disabledDb, environmentName: Environments.Production).Handle(
            new LoginCommand { Email = "admin@unistay.ba", Password = Password },
            CancellationToken.None);

        Assert.False(disabled.RequiresTwoFactor);
        Assert.Equal("access-101", disabled.AccessToken);

        await using var enabledDb = CreateDb();
        EnableTwoFactor(enabledDb, StudentId);
        var enabled = await CreateLoginHandler(enabledDb).Handle(
            new LoginCommand { Email = "student@test.com", Password = Password },
            CancellationToken.None);

        Assert.True(enabled.RequiresTwoFactor);
        Assert.NotNull(enabled.TwoFactorChallengeId);

        var setting = await enabledDb.TwoFactorSettings.SingleAsync(x => x.UserId == StudentId);
        setting.IsEnabled = false;
        setting.RequiresTwoFactor = false;
        await enabledDb.SaveChangesAsync();

        var afterDisable = await CreateLoginHandler(enabledDb).Handle(
            new LoginCommand { Email = "student@test.com", Password = Password },
            CancellationToken.None);

        Assert.False(afterDisable.RequiresTwoFactor);
        Assert.Equal("access-101", afterDisable.AccessToken);
    }

    [Fact]
    public async Task Trusted_Device_Bypasses_Only_When_TwoFactorSettings_Is_Enabled()
    {
        await using var db = CreateDb();
        EnableTwoFactor(db, StudentId);
        db.TrustedDevices.Add(new TrustedDeviceEntity
        {
            UserId = StudentId,
            TokenHash = "hash:device-1",
            ExpiresAtUtc = DateTime.UtcNow.AddDays(1)
        });
        await db.SaveChangesAsync();

        var result = await CreateLoginHandler(db).Handle(
            new LoginCommand { Email = "student@test.com", Password = Password, RememberMe = true, Fingerprint = "device-1" },
            CancellationToken.None);

        Assert.False(result.RequiresTwoFactor);
        Assert.Equal("access-101", result.AccessToken);
    }

    [Fact]
    public async Task Development_Demo_Bypass_Comes_From_Config_And_Is_Not_Used_In_Production()
    {
        await using var devDb = CreateDb();
        devDb.Users.Single(x => x.Id == StudentId).Email = "demo@unistay.ba";
        EnableTwoFactor(devDb, StudentId);
        await devDb.SaveChangesAsync();

        var dev = await CreateLoginHandler(
            devDb,
            environmentName: Environments.Development,
            options: new TwoFactorOptions { DevelopmentDemoBypassEmails = ["demo@unistay.ba"] }).Handle(
                new LoginCommand { Email = "demo@unistay.ba", Password = Password },
                CancellationToken.None);

        Assert.False(dev.RequiresTwoFactor);
        Assert.Equal("access-101", dev.AccessToken);

        await using var prodDb = CreateDb();
        prodDb.Users.Single(x => x.Id == StudentId).Email = "demo@unistay.ba";
        EnableTwoFactor(prodDb, StudentId);
        await prodDb.SaveChangesAsync();

        var prod = await CreateLoginHandler(
            prodDb,
            environmentName: Environments.Production,
            options: new TwoFactorOptions { DevelopmentDemoBypassEmails = ["demo@unistay.ba"] }).Handle(
                new LoginCommand { Email = "demo@unistay.ba", Password = Password },
                CancellationToken.None);

        Assert.True(prod.RequiresTwoFactor);
        Assert.NotNull(prod.TwoFactorChallengeId);
        Assert.True(await prodDb.TwoFactorLoginChallenges.AnyAsync(x => x.UserId == StudentId));
    }

    private static DatabaseContext CreateDb(TimeProvider? timeProvider = null)
    {
        var options = new DbContextOptionsBuilder<DatabaseContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        var db = new DatabaseContext(options, timeProvider ?? TimeProvider.System);
        var hasher = new PasswordHasher<UniStayUserEntity>();

        var student = CreateUser(StudentId, "student@test.com", isAdmin: false);
        var admin = CreateUser(AdminId, "admin@test.com", isAdmin: true);
        student.PasswordHash = hasher.HashPassword(student, Password);
        admin.PasswordHash = hasher.HashPassword(admin, Password);

        db.Users.AddRange(student, admin);
        db.SaveChanges();
        return db;
    }

    private static UniStayUserEntity CreateUser(int id, string email, bool isAdmin) =>
        new()
        {
            Id = id,
            Email = email,
            Firstname = "Test",
            Lastname = isAdmin ? "Admin" : "Student",
            Username = isAdmin ? "admin" : "student",
            PasswordHash = string.Empty,
            Phone = "000-000-0000",
            IsAdmin = isAdmin,
            IsStudent = !isAdmin,
            IsEnabled = true,
            CreatedAtUtc = DateTime.UtcNow
        };

    private static void EnableTwoFactor(DatabaseContext db, int userId)
    {
        db.TwoFactorSettings.Add(new TwoFactorSettingEntity
        {
            UserId = userId,
            IsEnabled = true,
            RequiresTwoFactor = true,
            Method = "email",
            EnabledAtUtc = DateTime.UtcNow
        });
        db.SaveChanges();
    }

    private static LoginCommandHandler CreateLoginHandler(
        DatabaseContext db,
        string environmentName = "Production",
        TwoFactorOptions? options = null,
        TimeProvider? timeProvider = null) =>
        new(
            db,
            new FakeJwtTokenService(),
            new PasswordHasher<UniStayUserEntity>(),
            new FakeSecurityTokenService(),
            new FakeEmailService(),
            timeProvider ?? TimeProvider.System,
            Options.Create(options ?? new TwoFactorOptions()),
            new FakeHostEnvironment(environmentName));

    private static VerifyTwoFactorCommandHandler CreateVerifyHandler(DatabaseContext db, TimeProvider? timeProvider = null) =>
        new(db, new FakeSecurityTokenService(), new FakeJwtTokenService(), timeProvider ?? TimeProvider.System);

    private sealed class FakeSecurityTokenService : ISecurityTokenService
    {
        private int _secureTokenCounter;

        public string GenerateSecureToken(int length = 48) => $"challenge-{++_secureTokenCounter}";
        public string GenerateNumericCode(int digits = 6) => "123456";
        public string Hash(string value) => $"hash:{value}";
    }

    private sealed class FakeJwtTokenService : IJwtTokenService
    {
        public JwtTokenPair IssueTokens(UniStayUserEntity user) =>
            new()
            {
                AccessToken = $"access-{user.Id}",
                RefreshTokenRaw = $"refresh-{user.Id}",
                RefreshTokenHash = $"refresh-hash-{user.Id}",
                RefreshTokenExpiresAtUtc = DateTime.UtcNow.AddDays(14)
            };

        public string HashRefreshToken(string rawToken) => $"refresh-hash:{rawToken}";
    }

    private sealed class FakeEmailService : IEmailService
    {
        public Task SendEmailAsync(string toEmail, string subject, string body, CancellationToken ct = default) => Task.CompletedTask;
        public Task SendInviteAsync(string toEmail, string inviteToken, CancellationToken ct = default) => Task.CompletedTask;
        public Task SendPasswordResetTokenAsync(string toEmail, string resetToken, CancellationToken ct = default) => Task.CompletedTask;
    }

    private sealed class FakeHostEnvironment(string environmentName) : IHostEnvironment
    {
        public string EnvironmentName { get; set; } = environmentName;
        public string ApplicationName { get; set; } = "UniStay.Tests";
        public string ContentRootPath { get; set; } = AppContext.BaseDirectory;
        public IFileProvider ContentRootFileProvider { get; set; } = new NullFileProvider();
    }
}
