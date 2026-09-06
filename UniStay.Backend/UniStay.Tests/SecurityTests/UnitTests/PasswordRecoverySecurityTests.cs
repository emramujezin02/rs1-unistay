using System.Reflection;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using UniStay.API.Controllers;
using UniStay.Application.Abstractions;
using UniStay.Application.Common.Exceptions;
using UniStay.Application.Modules.Account.Password.Commands.Reset;
using UniStay.Application.Modules.Account.Password.Commands.SendResetToken;
using UniStay.Application.Modules.Account.Password.Commands.StartRecovery;
using UniStay.Application.Modules.Account.Security.Commands.VerifyAnswers;
using UniStay.Application.Modules.Account.Security.Commands.SetAnswers;
using UniStay.Application.Modules.Account.Security.Common;
using UniStay.Application.Modules.Account.Security.Queries.GetAnswered;
using UniStay.Application.Modules.Account.Security.Queries.GetQuestionsForUser;
using UniStay.Application.Modules.Account.Security.Queries.GetRecoveryQuestions;
using UniStay.Domain.Entities.Identity;
using UniStay.Tests.Services;

namespace UniStay.Tests.SecurityTests.UnitTests;

public sealed class PasswordRecoverySecurityTests
{
    [Fact]
    public async Task VerifySecurityAnswers_ReturnsSuccessButDoesNotExposeResetToken()
    {
        await using var db = CreateDb();
        var emailService = new CapturingEmailService();
        var handler = CreateVerifyHandler(db, emailService);
        AddRecoveryContext(db, "valid-context", userId: 1);

        var response = await handler.Handle(new VerifySecurityAnswersCommand
        {
            RecoveryContextId = "valid-context",
            Answers = [new SecurityAnswerDto { QuestionId = 1, Answer = "Blue" }]
        }, CancellationToken.None);

        Assert.True(response.Success);
        Assert.DoesNotContain(
            typeof(VerifySecurityAnswersCommand).GetProperties(BindingFlags.Instance | BindingFlags.Public),
            property => property.Name.Equals("Email", StringComparison.OrdinalIgnoreCase));
        Assert.DoesNotContain(
            typeof(VerifySecurityAnswersCommandDto).GetProperties(BindingFlags.Instance | BindingFlags.Public),
            property => property.Name.Contains("Token", StringComparison.OrdinalIgnoreCase)
                || property.Name.Contains("Url", StringComparison.OrdinalIgnoreCase));
        Assert.Single(db.PasswordResetTokens);
        Assert.True(db.PasswordRecoveryContexts.Single().Consumed);
        Assert.Equal("hash:raw-reset-token", db.PasswordResetTokens.Single().TokenHash);
        Assert.Equal("student@test.com", emailService.PasswordResetEmails.Single().Email);
        Assert.Equal("raw-reset-token", emailService.PasswordResetEmails.Single().Token);
    }

    [Fact]
    public async Task VerifySecurityAnswers_WithInvalidAnswer_DoesNotGenerateTokenOrSendEmail()
    {
        await using var db = CreateDb();
        var emailService = new CapturingEmailService();
        var handler = CreateVerifyHandler(db, emailService);
        AddRecoveryContext(db, "valid-context", userId: 1);

        var exception = await Assert.ThrowsAsync<UniStayBusinessRuleException>(() => handler.Handle(new VerifySecurityAnswersCommand
        {
            RecoveryContextId = "valid-context",
            Answers = [new SecurityAnswerDto { QuestionId = 1, Answer = "Wrong" }]
        }, CancellationToken.None));

        Assert.Equal("SECURITY_ANSWERS_VERIFICATION_FAILED", exception.Code);
        Assert.Equal(1, db.PasswordRecoveryContexts.Single().FailedAttempts);
        Assert.Empty(db.PasswordResetTokens);
        Assert.Empty(emailService.PasswordResetEmails);
    }

    [Fact]
    public async Task VerifySecurityAnswers_WithRandomContext_ReturnsGenericFailureWithoutTokenOrEmail()
    {
        await using var db = CreateDb();
        var emailService = new CapturingEmailService();
        var handler = CreateVerifyHandler(db, emailService);

        var exception = await Assert.ThrowsAsync<UniStayBusinessRuleException>(() => handler.Handle(new VerifySecurityAnswersCommand
        {
            RecoveryContextId = "random-context",
            Answers = [new SecurityAnswerDto { QuestionId = 1, Answer = "Blue" }]
        }, CancellationToken.None));

        Assert.Equal("SECURITY_ANSWERS_VERIFICATION_FAILED", exception.Code);
        Assert.Empty(db.PasswordResetTokens);
        Assert.Empty(emailService.PasswordResetEmails);
    }

    [Fact]
    public async Task VerifySecurityAnswers_WithoutRecoveryContext_ReturnsGenericFailureWithoutTokenOrEmail()
    {
        await using var db = CreateDb();
        var emailService = new CapturingEmailService();
        var handler = CreateVerifyHandler(db, emailService);

        var exception = await Assert.ThrowsAsync<UniStayBusinessRuleException>(() => handler.Handle(new VerifySecurityAnswersCommand
        {
            Answers = [new SecurityAnswerDto { QuestionId = 1, Answer = "Blue" }]
        }, CancellationToken.None));

        Assert.Equal("SECURITY_ANSWERS_VERIFICATION_FAILED", exception.Code);
        Assert.Empty(db.PasswordResetTokens);
        Assert.Empty(emailService.PasswordResetEmails);
    }

    [Fact]
    public async Task VerifySecurityAnswers_WithExpiredContext_ReturnsGenericFailureWithoutTokenOrEmail()
    {
        await using var db = CreateDb();
        var emailService = new CapturingEmailService();
        var handler = CreateVerifyHandler(db, emailService);
        AddRecoveryContext(db, "expired-context", userId: 1, expiresAtUtc: DateTime.UtcNow.AddMinutes(-1));

        var exception = await Assert.ThrowsAsync<UniStayBusinessRuleException>(() => handler.Handle(new VerifySecurityAnswersCommand
        {
            RecoveryContextId = "expired-context",
            Answers = [new SecurityAnswerDto { QuestionId = 1, Answer = "Blue" }]
        }, CancellationToken.None));

        Assert.Equal("SECURITY_ANSWERS_VERIFICATION_FAILED", exception.Code);
        Assert.Empty(db.PasswordResetTokens);
        Assert.Empty(emailService.PasswordResetEmails);
    }

    [Fact]
    public async Task VerifySecurityAnswers_ContextForOneUserCannotVerifyAnotherUser()
    {
        await using var db = CreateDb();
        var emailService = new CapturingEmailService();
        var handler = CreateVerifyHandler(db, emailService);
        AddRecoveryContext(db, "student-context", userId: 1);

        var exception = await Assert.ThrowsAsync<UniStayBusinessRuleException>(() => handler.Handle(new VerifySecurityAnswersCommand
        {
            RecoveryContextId = "student-context",
            Answers = [new SecurityAnswerDto { QuestionId = 2, Answer = "Green" }]
        }, CancellationToken.None));

        Assert.Equal("SECURITY_ANSWERS_VERIFICATION_FAILED", exception.Code);
        Assert.Empty(db.PasswordResetTokens);
        Assert.Empty(emailService.PasswordResetEmails);
    }

    [Fact]
    public void AccountSecurityQuestionLookupEndpoints_RequireAuthorization()
    {
        AssertEndpointRequiresAuthorization(nameof(AccountSecurityController.GetQuestionsForUser));
        AssertEndpointRequiresAuthorization(nameof(AccountSecurityController.GetAnsweredQuestions));
    }

    [Fact]
    public async Task QuestionsForUser_UsesCurrentAuthenticatedUser()
    {
        await using var db = CreateDb();
        var handler = new GetSecurityQuestionsForUserQueryHandler(db, new FakeAppCurrentUser(1));

        var questions = await handler.Handle(new GetSecurityQuestionsForUserQuery(), CancellationToken.None);

        Assert.Single(questions);
        Assert.Equal(1, questions.Single().QuestionId);
        Assert.Equal("Student question", questions.Single().Question);
    }

    [Fact]
    public async Task AnsweredQuestions_UsesCurrentAuthenticatedUser()
    {
        await using var db = CreateDb();
        var handler = new GetAnsweredSecurityQuestionsQueryHandler(db, new FakeAppCurrentUser(1));

        var answered = await handler.Handle(new GetAnsweredSecurityQuestionsQuery(), CancellationToken.None);

        Assert.Single(answered);
        Assert.Equal(1, answered.Single().QuestionId);
    }

    [Fact]
    public async Task AnsweredQuestions_ForUserWithoutAnswers_ReturnsEmptyList()
    {
        await using var db = CreateDb();
        var handler = new GetAnsweredSecurityQuestionsQueryHandler(db, new FakeAppCurrentUser(3));

        var answered = await handler.Handle(new GetAnsweredSecurityQuestionsQuery(), CancellationToken.None);

        Assert.Empty(answered);
    }

    [Fact]
    public async Task SetSecurityAnswers_ForCurrentUserWithoutAnswers_PersistsAnswers()
    {
        await using var db = CreateDb();
        var handler = new SetSecurityAnswersCommandHandler(
            db,
            new PasswordHasher<UniStayUserEntity>(),
            new FakeAppCurrentUser(3));

        await handler.Handle(new SetSecurityAnswersCommand
        {
            UserId = 1,
            Answers =
            [
                new SecurityAnswerDto { QuestionId = 1, Answer = "Red" },
                new SecurityAnswerDto { QuestionId = 2, Answer = "Yellow" }
            ]
        }, CancellationToken.None);

        var saved = db.UserSecurityAnswers
            .Where(x => x.UserId == 3)
            .OrderBy(x => x.SecurityQuestionId)
            .ToList();

        Assert.Equal(2, saved.Count);
        Assert.Equal(new[] { 1, 2 }, saved.Select(x => x.SecurityQuestionId).ToArray());
        Assert.All(saved, answer => Assert.False(string.IsNullOrWhiteSpace(answer.AnswerHash)));
        Assert.Empty(db.UserSecurityAnswers.Where(x => x.UserId == 1 && x.SecurityQuestionId == 2));
    }

    [Fact]
    public async Task SetSecurityAnswers_UpdatesExistingAnswerWithoutCreatingDuplicate()
    {
        await using var db = CreateDb();
        var handler = new SetSecurityAnswersCommandHandler(
            db,
            new PasswordHasher<UniStayUserEntity>(),
            new FakeAppCurrentUser(1));

        await handler.Handle(new SetSecurityAnswersCommand
        {
            Answers = [new SecurityAnswerDto { QuestionId = 1, Answer = "Navy" }]
        }, CancellationToken.None);

        Assert.Single(db.UserSecurityAnswers.Where(x => x.UserId == 1 && x.SecurityQuestionId == 1));
    }

    [Fact]
    public async Task SetSecurityAnswers_IgnoresSpoofedUserIdAndUsesCurrentUser()
    {
        await using var db = CreateDb();
        var handler = new SetSecurityAnswersCommandHandler(
            db,
            new PasswordHasher<UniStayUserEntity>(),
            new FakeAppCurrentUser(3));

        await handler.Handle(new SetSecurityAnswersCommand
        {
            UserId = 2,
            Answers = [new SecurityAnswerDto { QuestionId = 1, Answer = "Purple" }]
        }, CancellationToken.None);

        Assert.Contains(db.UserSecurityAnswers, x => x.UserId == 3 && x.SecurityQuestionId == 1);
        Assert.DoesNotContain(db.UserSecurityAnswers, x => x.UserId == 2 && x.SecurityQuestionId == 1);
    }

    [Fact]
    public async Task QuestionLookupHandlers_RejectAnonymousCurrentUser()
    {
        await using var db = CreateDb();
        var questionsHandler = new GetSecurityQuestionsForUserQueryHandler(db, new FakeAppCurrentUser());
        var answeredHandler = new GetAnsweredSecurityQuestionsQueryHandler(db, new FakeAppCurrentUser());

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            questionsHandler.Handle(
                new GetSecurityQuestionsForUserQuery(),
                CancellationToken.None));

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            answeredHandler.Handle(
                new GetAnsweredSecurityQuestionsQuery(),
                CancellationToken.None));
    }

    [Fact]
    public async Task SendPasswordResetToken_ForExistingEmail_GeneratesTokenAndSendsEmail()
    {
        await using var db = CreateDb();
        var emailService = new CapturingEmailService();
        var handler = CreateSendResetTokenHandler(db, emailService);

        var result = await handler.Handle(new SendPasswordResetTokenCommand { Email = "student@test.com" }, CancellationToken.None);

        Assert.False(string.IsNullOrWhiteSpace(result.RecoveryContextId));
        Assert.Equal("If an account with this email exists, password reset instructions have been sent.", result.Message);
        Assert.Single(db.PasswordResetTokens);
        Assert.Empty(db.PasswordRecoveryContexts);
        Assert.Equal("student@test.com", emailService.PasswordResetEmails.Single().Email);
        Assert.Equal("raw-reset-token", emailService.PasswordResetEmails.Single().Token);
    }

    [Fact]
    public async Task SendPasswordResetToken_ForMissingEmail_ReturnsSameCommandResultWithoutTokenOrEmail()
    {
        await using var db = CreateDb();
        var emailService = new CapturingEmailService();
        var handler = CreateSendResetTokenHandler(db, emailService);

        var result = await handler.Handle(new SendPasswordResetTokenCommand { Email = "missing@test.com" }, CancellationToken.None);

        Assert.False(string.IsNullOrWhiteSpace(result.RecoveryContextId));
        Assert.Equal("If an account with this email exists, password reset instructions have been sent.", result.Message);
        Assert.Empty(db.PasswordResetTokens);
        Assert.Empty(db.PasswordRecoveryContexts);
        Assert.Empty(emailService.PasswordResetEmails);
    }

    [Fact]
    public async Task StartPasswordRecovery_ForExistingEmail_CreatesContextWithoutSendingResetToken()
    {
        await using var db = CreateDb();
        var handler = CreateStartRecoveryHandler(db);

        var result = await handler.Handle(new StartPasswordRecoveryCommand { Email = "student@test.com" }, CancellationToken.None);

        Assert.False(string.IsNullOrWhiteSpace(result.RecoveryContextId));
        Assert.Single(db.PasswordRecoveryContexts);
        Assert.Empty(db.PasswordResetTokens);
    }

    [Fact]
    public async Task StartPasswordRecovery_ForMissingEmail_ReturnsSameShapeWithoutContextOrEmailToken()
    {
        await using var db = CreateDb();
        var handler = CreateStartRecoveryHandler(db);

        var result = await handler.Handle(new StartPasswordRecoveryCommand { Email = "missing@test.com" }, CancellationToken.None);

        Assert.False(string.IsNullOrWhiteSpace(result.RecoveryContextId));
        Assert.Empty(db.PasswordRecoveryContexts);
        Assert.Empty(db.PasswordResetTokens);
    }

    [Fact]
    public async Task RecoveryQuestions_WithValidContext_ReturnsOnlyQuestionsForContextUser()
    {
        await using var db = CreateDb();
        AddRecoveryContext(db, "student-context", userId: 1);
        var handler = CreateRecoveryQuestionsHandler(db);

        var questions = await handler.Handle(new GetRecoverySecurityQuestionsQuery
        {
            RecoveryContextId = "student-context"
        }, CancellationToken.None);

        Assert.Single(questions);
        Assert.Equal(1, questions.Single().QuestionId);
        Assert.Equal("Student question", questions.Single().Question);
    }

    [Fact]
    public async Task RecoveryQuestions_WithRandomContext_ReturnsGenericFailure()
    {
        await using var db = CreateDb();
        var handler = CreateRecoveryQuestionsHandler(db);

        var exception = await Assert.ThrowsAsync<UniStayBusinessRuleException>(() =>
            handler.Handle(new GetRecoverySecurityQuestionsQuery { RecoveryContextId = "random-context" }, CancellationToken.None));

        Assert.Equal("RECOVERY_QUESTIONS_UNAVAILABLE", exception.Code);
    }

    [Fact]
    public async Task RecoveryQuestions_WithExpiredContext_ReturnsGenericFailure()
    {
        await using var db = CreateDb();
        AddRecoveryContext(db, "expired-context", userId: 1, expiresAtUtc: DateTime.UtcNow.AddMinutes(-1));
        var handler = CreateRecoveryQuestionsHandler(db);

        var exception = await Assert.ThrowsAsync<UniStayBusinessRuleException>(() =>
            handler.Handle(new GetRecoverySecurityQuestionsQuery { RecoveryContextId = "expired-context" }, CancellationToken.None));

        Assert.Equal("RECOVERY_QUESTIONS_UNAVAILABLE", exception.Code);
    }

    [Fact]
    public async Task RecoveryQuestions_ForUserWithoutAnswers_ReturnsGenericFailure()
    {
        await using var db = CreateDb();
        AddRecoveryContext(db, "no-answers-context", userId: 3);
        var handler = CreateRecoveryQuestionsHandler(db);

        var exception = await Assert.ThrowsAsync<UniStayBusinessRuleException>(() =>
            handler.Handle(new GetRecoverySecurityQuestionsQuery { RecoveryContextId = "no-answers-context" }, CancellationToken.None));

        Assert.Equal("RECOVERY_QUESTIONS_UNAVAILABLE", exception.Code);
    }

    [Fact]
    public async Task ResetPassword_UsesEmailTokenAndRejectsUsedToken()
    {
        await using var db = CreateDb();
        var emailService = new CapturingEmailService();
        await CreateSendResetTokenHandler(db, emailService)
            .Handle(new SendPasswordResetTokenCommand { Email = "student@test.com" }, CancellationToken.None);

        var handler = new ResetPasswordCommandHandler(
            db,
            new FakeSecurityTokenService(),
            new PasswordHasher<UniStayUserEntity>(),
            TimeProvider.System);

        await handler.Handle(new ResetPasswordCommand { Token = "raw-reset-token", NewPassword = "NewPass123!" }, CancellationToken.None);

        Assert.True(db.PasswordResetTokens.Single().Used);
        await Assert.ThrowsAsync<UniStayBusinessRuleException>(() =>
            handler.Handle(new ResetPasswordCommand { Token = "raw-reset-token", NewPassword = "AnotherPass123!" }, CancellationToken.None));
    }

    [Fact]
    public async Task ResetPassword_RejectsExpiredToken()
    {
        await using var db = CreateDb();
        db.PasswordResetTokens.Add(new PasswordResetTokenEntity
        {
            UserId = 1,
            TokenHash = "hash:expired-token",
            ExpiresAtUtc = DateTime.UtcNow.AddMinutes(-1),
            Used = false
        });
        await db.SaveChangesAsync();

        var handler = new ResetPasswordCommandHandler(
            db,
            new FakeSecurityTokenService(),
            new PasswordHasher<UniStayUserEntity>(),
            TimeProvider.System);

        await Assert.ThrowsAsync<UniStayBusinessRuleException>(() =>
            handler.Handle(new ResetPasswordCommand { Token = "expired-token", NewPassword = "NewPass123!" }, CancellationToken.None));
    }

    private static void AssertEndpointRequiresAuthorization(string methodName)
    {
        var method = typeof(AccountSecurityController).GetMethod(methodName)
            ?? throw new InvalidOperationException($"Missing controller action {methodName}.");

        Assert.Contains(method.GetCustomAttributes<AuthorizeAttribute>(), _ => true);
        Assert.DoesNotContain(method.GetCustomAttributes<AllowAnonymousAttribute>(), _ => true);
    }

    private static VerifySecurityAnswersCommandHandler CreateVerifyHandler(
        DatabaseContext db,
        CapturingEmailService emailService) =>
        new(
            db,
            new PasswordHasher<UniStayUserEntity>(),
            new FakeSecurityTokenService(),
            emailService,
            TimeProvider.System);

    private static SendPasswordResetTokenCommandHandler CreateSendResetTokenHandler(
        DatabaseContext db,
        CapturingEmailService emailService) =>
        new(db, new FakeSecurityTokenService(), emailService, TimeProvider.System);

    private static StartPasswordRecoveryCommandHandler CreateStartRecoveryHandler(DatabaseContext db) =>
        new(db, new FakeSecurityTokenService(), TimeProvider.System);

    private static GetRecoverySecurityQuestionsQueryHandler CreateRecoveryQuestionsHandler(DatabaseContext db) =>
        new(db, new FakeSecurityTokenService(), TimeProvider.System);

    private static void AddRecoveryContext(
        DatabaseContext db,
        string contextId,
        int userId,
        DateTime? expiresAtUtc = null)
    {
        db.PasswordRecoveryContexts.Add(new PasswordRecoveryContextEntity
        {
            UserId = userId,
            ContextHash = $"hash:{contextId}",
            ExpiresAtUtc = expiresAtUtc ?? DateTime.UtcNow.AddMinutes(15),
            FailedAttempts = 0,
            MaxAttempts = 5,
            Consumed = false
        });
        db.SaveChanges();
    }

    private static DatabaseContext CreateDb()
    {
        var options = new DbContextOptionsBuilder<DatabaseContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        var db = new DatabaseContext(options, TimeProvider.System);
        var hasher = new PasswordHasher<UniStayUserEntity>();
        var student = CreateUser(1, "student@test.com");
        var other = CreateUser(2, "other@test.com");
        var noAnswers = CreateUser(3, "noanswers@test.com");

        db.Users.AddRange(student, other, noAnswers);
        db.SecurityQuestions.AddRange(
            new SecurityQuestionEntity { Id = 1, Text = "Student question" },
            new SecurityQuestionEntity { Id = 2, Text = "Other question" });
        db.UserSecurityAnswers.AddRange(
            new UserSecurityAnswerEntity
            {
                Id = 1,
                UserId = student.Id,
                SecurityQuestionId = 1,
                AnswerHash = hasher.HashPassword(student, "blue")
            },
            new UserSecurityAnswerEntity
            {
                Id = 2,
                UserId = other.Id,
                SecurityQuestionId = 2,
                AnswerHash = hasher.HashPassword(other, "green")
            });
        db.SaveChanges();

        return db;
    }

    private static UniStayUserEntity CreateUser(int id, string email) =>
        new()
        {
            Id = id,
            Email = email,
            Firstname = "Test",
            Lastname = "User",
            Username = email,
            PasswordHash = "old-hash",
            Phone = "000-000-0000",
            IsStudent = true,
            IsEnabled = true,
            CreatedAtUtc = DateTime.UtcNow
        };

    private sealed class FakeSecurityTokenService : ISecurityTokenService
    {
        public string GenerateSecureToken(int length = 48) => "raw-reset-token";
        public string GenerateNumericCode(int digits = 6) => "123456";
        public string Hash(string value) => $"hash:{value}";
    }

    private sealed class CapturingEmailService : IEmailService
    {
        public List<(string Email, string Token)> PasswordResetEmails { get; } = [];

        public Task SendEmailAsync(string toEmail, string subject, string body, CancellationToken ct = default) =>
            Task.CompletedTask;

        public Task SendInviteAsync(string toEmail, string inviteToken, CancellationToken ct = default) =>
            Task.CompletedTask;

        public Task SendPasswordResetTokenAsync(string toEmail, string resetToken, CancellationToken ct = default)
        {
            PasswordResetEmails.Add((toEmail, resetToken));
            return Task.CompletedTask;
        }
    }
}
