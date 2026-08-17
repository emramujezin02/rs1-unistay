namespace UniStay.Application.Abstractions;

public interface IEmailService
{
    Task SendEmailAsync(string toEmail, string subject, string body, CancellationToken ct = default);
    Task SendInviteAsync(string toEmail, string inviteToken, CancellationToken ct = default);
    Task SendPasswordResetTokenAsync(string toEmail, string resetToken, CancellationToken ct = default);
}
