using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using UniStay.Application.Abstractions;
using UniStay.Application.Modules.Communication.Chat.Commands.Send;
using UniStay.Application.Modules.Communication.Chat.Queries.ListConversations;
using UniStay.Application.Modules.Communication.Chat.Queries.ListMessages;
using UniStay.Application.Modules.Communication.Chat.Queries.SearchUsers;
using UniStay.Domain.Entities.Identity;
using UniStay.Infrastructure.Hubs;

namespace UniStay.API.Controllers;

[ApiController]
[Authorize]
[Route("api/student/chat")]
public sealed class StudentChatController(
    ISender sender,
    IAppDbContext context,
    IAppCurrentUser currentUser,
    IHubContext<ChatHub> hub) : ControllerBase
{
    [HttpGet("conversations")]
    public async Task<IActionResult> GetConversations(CancellationToken ct)
    {
        var student = await GetCurrentStudentAsync(ct);
        if (student is null)
            return Forbid();

        var conversations = await sender.Send(new ListChatConversationsQuery
        {
            UserId = student.Id
        }, ct);

        return Ok(conversations);
    }

    [HttpGet("messages")]
    public async Task<IActionResult> GetMessages([FromQuery] int otherUserId, CancellationToken ct)
    {
        var student = await GetCurrentStudentAsync(ct);
        if (student is null)
            return Forbid();

        var messages = await sender.Send(new ListChatMessagesQuery
        {
            UserId = student.Id,
            OtherUserId = otherUserId
        }, ct);

        return Ok(messages);
    }

    [HttpGet("search-users")]
    public async Task<IActionResult> SearchUsers([FromQuery] string username, CancellationToken ct)
    {
        var student = await GetCurrentStudentAsync(ct);
        if (student is null)
            return Forbid();

        var users = await sender.Send(new SearchChatUsersQuery
        {
            Username = username ?? string.Empty,
            ExcludeUserId = student.Id
        }, ct);

        return Ok(users);
    }

    [HttpPost("send")]
    public async Task<IActionResult> Send([FromBody] StudentSendChatMessageRequest request, CancellationToken ct)
    {
        var student = await GetCurrentStudentAsync(ct);
        if (student is null)
            return Forbid();

        var message = await sender.Send(new SendChatMessageCommand
        {
            SenderUserId = student.Id,
            ReceiverUserId = request.ReceiverUserId,
            Subject = request.Subject,
            MessageText = request.MessageText
        }, ct);

        var receiverConnection = ChatHub.GetConnection(request.ReceiverUserId);
        if (receiverConnection is not null)
        {
            await hub.Clients.Client(receiverConnection).SendAsync("ReceiveMessage", new
            {
                senderId = message.SenderId,
                senderName = message.SenderName,
                receiverId = message.ReceiverId,
                content = message.Content,
                sentAt = message.SentAtUtc
            }, ct);
        }

        return Ok(new
        {
            messageID = message.Id,
            senderId = message.SenderId,
            receiverId = message.ReceiverId,
            senderName = message.SenderName,
            content = message.Content,
            messageText = message.Content,
            sentAt = message.SentAtUtc,
            sentAtUtc = message.SentAtUtc,
            senderUserID = message.SenderId,
            receiverUserID = message.ReceiverId
        });
    }

    private async Task<UniStayUserEntity?> GetCurrentStudentAsync(CancellationToken ct)
    {
        if (!currentUser.IsAuthenticated || currentUser.UserId is null)
            return null;

        return await context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == currentUser.UserId.Value && x.IsEnabled && x.IsStudent, ct);
    }

    public sealed class StudentSendChatMessageRequest
    {
        public int ReceiverUserId { get; set; }
        public string? Subject { get; set; }
        public string MessageText { get; set; } = string.Empty;
    }
}
