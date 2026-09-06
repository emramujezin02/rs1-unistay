using Microsoft.Extensions.Time.Testing;
using UniStay.Application.Modules.Communication.Chat.Commands.Send;
using UniStay.Application.Modules.Communication.Chat.Queries.ListConversations;
using UniStay.Application.Modules.Communication.Chat.Queries.ListMessages;
using UniStay.Domain.Entities.Communication;
using UniStay.Domain.Entities.Identity;
using UniStay.Tests.Services;

namespace UniStay.Tests.SecurityTests.UnitTests;

public class ChatAuthorizationTests
{
    private const int UserAId = 1001;
    private const int UserBId = 1002;
    private const int UserCId = 1003;

    [Fact]
    public async Task Send_Should_Reject_Sender_Impersonation()
    {
        await using var db = CreateDb();
        var handler = new SendChatMessageCommandHandler(db, TimeProvider.System, UserA());

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            handler.Handle(new SendChatMessageCommand
            {
                SenderUserId = UserBId,
                ReceiverUserId = UserCId,
                MessageText = "Forged"
            }, CancellationToken.None));

        Assert.False(await db.Messages.AsNoTracking().AnyAsync(x => x.MessageText == "Forged"));
    }

    [Fact]
    public async Task Send_Should_Save_Authenticated_User_As_Sender()
    {
        var sentAt = DateTimeOffset.Parse("2026-09-04T13:00:00Z");
        await using var db = CreateDb();
        var handler = new SendChatMessageCommandHandler(db, new FakeTimeProvider(sentAt), UserA());

        var result = await handler.Handle(new SendChatMessageCommand
        {
            SenderUserId = UserAId,
            ReceiverUserId = UserBId,
            MessageText = "Hello B"
        }, CancellationToken.None);

        var saved = await db.Messages.AsNoTracking().SingleAsync(x => x.Id == result.Id);
        Assert.Equal(UserAId, saved.SenderUserId);
        Assert.Equal(UserBId, saved.ReceiverUserId);
        Assert.Equal(sentAt.UtcDateTime, saved.SentAtUtc);
    }

    [Fact]
    public async Task Conversations_Should_Reject_Request_For_Another_User()
    {
        await using var db = CreateDb();
        var handler = new ListChatConversationsQueryHandler(db, UserA());

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            handler.Handle(new ListChatConversationsQuery { UserId = UserBId }, CancellationToken.None));
    }

    [Fact]
    public async Task Conversations_Should_Return_Only_Current_Users_Conversations()
    {
        await using var db = CreateDb();
        var handler = new ListChatConversationsQueryHandler(db, UserA());

        var conversations = await handler.Handle(new ListChatConversationsQuery { UserId = UserAId }, CancellationToken.None);

        Assert.Contains(conversations, x => x.UserId == UserBId);
        Assert.DoesNotContain(conversations, x => x.UserId == UserCId);
    }

    [Fact]
    public async Task Messages_Should_Reject_Third_Party_History_Request()
    {
        await using var db = CreateDb();
        var handler = new ListChatMessagesQueryHandler(db, UserA());

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            handler.Handle(new ListChatMessagesQuery
            {
                UserId = UserBId,
                OtherUserId = UserCId
            }, CancellationToken.None));
    }

    [Fact]
    public async Task Messages_Should_Return_Only_Current_User_And_Selected_Other_User()
    {
        await using var db = CreateDb();
        var handler = new ListChatMessagesQueryHandler(db, UserA());

        var messages = await handler.Handle(new ListChatMessagesQuery
        {
            UserId = UserAId,
            OtherUserId = UserBId
        }, CancellationToken.None);

        Assert.All(messages, message =>
        {
            Assert.True(
                (message.SenderId == UserAId && message.ReceiverId == UserBId) ||
                (message.SenderId == UserBId && message.ReceiverId == UserAId));
        });
        Assert.DoesNotContain(messages, x => x.SenderId == UserBId && x.ReceiverId == UserCId);
    }

    private static DatabaseContext CreateDb()
    {
        var options = new DbContextOptionsBuilder<DatabaseContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        var db = new DatabaseContext(options, TimeProvider.System);
        db.Users.AddRange(
            User(UserAId, "user.a@test.com"),
            User(UserBId, "user.b@test.com"),
            User(UserCId, "user.c@test.com"));

        db.Messages.AddRange(
            Message(1, UserAId, UserBId, "A to B", DateTime.UtcNow.AddMinutes(-3)),
            Message(2, UserBId, UserAId, "B to A", DateTime.UtcNow.AddMinutes(-2)),
            Message(3, UserBId, UserCId, "B to C private", DateTime.UtcNow.AddMinutes(-1)));

        db.SaveChanges();
        return db;
    }

    private static MessageEntity Message(int id, int senderId, int receiverId, string text, DateTime sentAtUtc) => new()
    {
        Id = id,
        SenderUserId = senderId,
        ReceiverUserId = receiverId,
        MessageText = text,
        SentAtUtc = sentAtUtc,
        IsRead = false
    };

    private static UniStayUserEntity User(int id, string email) => new()
    {
        Id = id,
        Email = email,
        Username = email,
        Firstname = "Test",
        Lastname = id.ToString(),
        Phone = "000",
        PasswordHash = "hash",
        IsEnabled = true,
        IsStudent = true
    };

    private static FakeAppCurrentUser UserA() => new(UserAId);
}
