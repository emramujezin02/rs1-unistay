using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using UniStay.Application.Abstractions;
using UniStay.Domain.Entities.Communication;
using UniStay.Domain.Entities.Identity;
using UniStay.Infrastructure.Hubs;

namespace UniStay.API.Controllers;

[ApiController]
[Authorize]
[Route("api/chat")]
public sealed class ChatController(IAppDbContext context, IHubContext<ChatHub> hub) : ControllerBase
{
    [HttpPost("/api/messages/send")]
    public async Task<IActionResult> Send([FromBody] MessageDto dto, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(dto.MessageText))
            return BadRequest("Message text is required.");

        var senderUser = await context.Users
            .FirstOrDefaultAsync(x => x.Id == dto.SenderUserID, ct);

        if (senderUser is null)
            return BadRequest("Sender not found");

        var receiverExists = await context.Users
            .AnyAsync(x => x.Id == dto.ReceiverUserID, ct);

        if (!receiverExists)
            return BadRequest("Receiver not found");

        var msg = new MessageEntity
        {
            SenderUserId = dto.SenderUserID,
            ReceiverUserId = dto.ReceiverUserID,
            MessageText = dto.MessageText.Trim(),
            SentAtUtc = DateTime.UtcNow,
            IsRead = false
        };

        context.Messages.Add(msg);
        await context.SaveChangesAsync(ct);

        var receiverConnection = ChatHub.GetConnection(dto.ReceiverUserID);

        if (receiverConnection is not null)
        {
            await hub.Clients.Client(receiverConnection).SendAsync("ReceiveMessage", new
            {
                senderId = senderUser.Id,
                senderName = UserDisplayName(senderUser),
                content = msg.MessageText
            }, ct);
        }

        return Ok(new
        {
            messageID = msg.Id,
            senderId = msg.SenderUserId,
            receiverId = msg.ReceiverUserId,
            senderName = UserDisplayName(senderUser),
            content = msg.MessageText,
            subject = msg.Subject,
            messageText = msg.MessageText,
            sentAt = msg.SentAtUtc,
            isRead = msg.IsRead,
            senderUserID = msg.SenderUserId,
            receiverUserID = msg.ReceiverUserId
        });
    }

    [HttpGet("conversations/{userId:int}")]
    public async Task<IActionResult> GetConversations(int userId, CancellationToken ct)
    {
        var conversations = await context.Messages
            .AsNoTracking()
            .Include(m => m.SenderUser)
            .Include(m => m.ReceiverUser)
            .Where(m => m.SenderUserId == userId || m.ReceiverUserId == userId)
            .Select(m => new
            {
                UserId = m.SenderUserId == userId ? m.ReceiverUserId : m.SenderUserId,
                DisplayName = m.SenderUserId == userId
                    ? UserDisplayName(m.ReceiverUser)
                    : UserDisplayName(m.SenderUser)
            })
            .Distinct()
            .ToListAsync(ct);

        return Ok(conversations);
    }

    [HttpGet("messages")]
    public async Task<IActionResult> GetMessages([FromQuery] int userId, [FromQuery] int otherUserId, CancellationToken ct)
    {
        var messages = await context.Messages
            .AsNoTracking()
            .Include(m => m.SenderUser)
            .Where(m =>
                (m.SenderUserId == userId && m.ReceiverUserId == otherUserId) ||
                (m.SenderUserId == otherUserId && m.ReceiverUserId == userId))
            .OrderBy(m => m.SentAtUtc)
            .Select(m => new
            {
                SenderId = m.SenderUserId,
                SenderName = UserDisplayName(m.SenderUser),
                ReceiverId = m.ReceiverUserId,
                Content = m.MessageText,
                SentAt = m.SentAtUtc
            })
            .ToListAsync(ct);

        return Ok(messages);
    }

    [HttpGet("search-users")]
    public async Task<IActionResult> SearchUsers([FromQuery] string username, CancellationToken ct)
    {
        var term = username?.Trim() ?? string.Empty;

        var users = await context.Users
            .AsNoTracking()
            .Where(u => u.Username.Contains(term))
            .Select(u => new
            {
                UserId = u.Id,
                DisplayName = UserDisplayName(u)
            })
            .Take(10)
            .ToListAsync(ct);

        return Ok(users);
    }

    private static string UserDisplayName(UniStayUserEntity user)
    {
        if (!string.IsNullOrWhiteSpace(user.Username))
            return user.Username;

        var fullName = $"{user.Firstname} {user.Lastname}".Trim();
        return string.IsNullOrWhiteSpace(fullName) ? user.Email : fullName;
    }

    public sealed class MessageDto
    {
        public int SenderUserID { get; set; }
        public int ReceiverUserID { get; set; }
        public string MessageText { get; set; } = string.Empty;
    }
}
