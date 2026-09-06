using UniStay.Application.Abstractions;
using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;

namespace UniStay.Infrastructure.Common;

public sealed class EmailService(IConfiguration configuration) : IEmailService
{
    public async Task SendEmailAsync(string toEmail, string subject, string body, CancellationToken ct = default)
    {
        var host = configuration["EmailSettings:SmtpHost"];
        var portText = configuration["EmailSettings:SmtpPort"];
        var user = configuration["EmailSettings:SmtpUser"];
        var pass = configuration["EmailSettings:SmtpPass"];

        if (string.IsNullOrWhiteSpace(host) || string.IsNullOrWhiteSpace(portText) || string.IsNullOrWhiteSpace(user))
            return;

        using var smtp = new SmtpClient(host)
        {
            Port = int.Parse(portText),
            EnableSsl = true,
            UseDefaultCredentials = false,
            Credentials = new NetworkCredential(user, pass)
        };

        using var mail = new MailMessage
        {
            From = new MailAddress(user, "UniStay Notifications"),
            Subject = subject,
            Body = body,
            IsBodyHtml = true
        };

        mail.To.Add(toEmail);
        await smtp.SendMailAsync(mail, ct);
    }

    public Task SendInviteAsync(string toEmail, string inviteToken, CancellationToken ct = default)
    {
        var baseUrl = configuration["Frontend:BaseUrl"];
        if (string.IsNullOrWhiteSpace(baseUrl))
            baseUrl = "http://localhost:4200";

        var inviteLink = $"{baseUrl.TrimEnd('/')}/register?invite={WebUtility.UrlEncode(inviteToken)}";
        var body = $"Click this link to join UniStay: {inviteLink}";

        return SendEmailAsync(toEmail, "You're invited to UniStay", body, ct);
    }

    public Task SendPasswordResetTokenAsync(string toEmail, string resetToken, CancellationToken ct = default)
    {
        var baseUrl = configuration["Frontend:BaseUrl"];

        if (string.IsNullOrWhiteSpace(baseUrl))
            baseUrl = "http://localhost:4200";

        var resetLink =
            $"{baseUrl.TrimEnd('/')}/password-recovery?token={WebUtility.UrlEncode(resetToken)}";

        var body = $"""
        <h2>Password Reset</h2>
        <p>You requested to reset your UniStay password.</p>

        <p>
            <a href="{resetLink}">
                Reset your password
            </a>
        </p>

        <p>If the link does not work, you can enter this token manually:</p>

        <p><b>{WebUtility.HtmlEncode(resetToken)}</b></p>

        <p>This token is temporary and can only be used once.</p>
        """;

        return SendEmailAsync(
            toEmail,
            "Password Reset Request",
            body,
            ct);
    }
}
