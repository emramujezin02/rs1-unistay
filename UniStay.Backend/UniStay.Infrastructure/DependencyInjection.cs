using UniStay.Application.Abstractions;
using UniStay.Infrastructure.BackgroundServices;
using UniStay.Infrastructure.Common;
using UniStay.Infrastructure.Database;
using UniStay.Infrastructure.Firebase;
using UniStay.Infrastructure.Pdf;
using UniStay.Infrastructure.Services;
using UniStay.Shared.Constants;
using UniStay.Shared.Options;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Stripe;

namespace UniStay.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration,
        IHostEnvironment env)
    {
        // Typed ConnectionStrings + validation
        services.AddOptions<ConnectionStringsOptions>()
            .Bind(configuration.GetSection(ConnectionStringsOptions.SectionName))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services.AddOptions<TwoFactorOptions>()
            .Bind(configuration.GetSection(TwoFactorOptions.SectionName))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        // DbContext: InMemory for test environments; SQL Server otherwise
        services.AddDbContext<DatabaseContext>((sp, options) =>
        {
            if (env.IsTest())
            {
                options.UseInMemoryDatabase("IntegrationTestsDb");

                return;
            }

            var cs = sp.GetRequiredService<IOptions<ConnectionStringsOptions>>().Value.Main;
            options.UseSqlServer(cs);
        });

        // IAppDbContext mapping
        services.AddScoped<IAppDbContext>(sp => sp.GetRequiredService<DatabaseContext>());

        // Identity hasher
        services.AddScoped<IPasswordHasher<UniStayUserEntity>, PasswordHasher<UniStayUserEntity>>();

        // Token service (reads JwtOptions via IOptions<JwtOptions>)
        services.AddTransient<IJwtTokenService, JwtTokenService>();
        services.AddTransient<ISecurityTokenService, SecurityTokenService>();
        services.AddTransient<IEmailService, EmailService>();
        services.AddSingleton<IFirebasePushService, FirebasePushService>();
        services.AddScoped<INotificationService, NotificationService>();
        services.AddHttpClient("Webhooks", client =>
        {
            client.Timeout = TimeSpan.FromSeconds(10);
        });
        services.AddScoped<IWebhookDispatcher, WebhookDispatcher>();
        services.AddHttpClient("Captcha", client =>
        {
            client.Timeout = TimeSpan.FromSeconds(10);
        });
        services.AddScoped<ICaptchaService, CaptchaService>();
        services.AddScoped<IStripeService, StripeService>();
        services.AddScoped<IInvoicePdfService, InvoicePdfGenerator>();
        services.AddScoped<IFileStorageService, LocalFileStorageService>();
        StripeConfiguration.ApiKey = configuration["Stripe:SecretKey"];

        // HttpContext accessor + current user
        services.AddHttpContextAccessor();
        services.AddScoped<IAppCurrentUser, AppCurrentUser>();

        // TimeProvider (if used in handlers/services)
        services.AddSingleton<TimeProvider>(TimeProvider.System);
        services.AddHostedService<AnalyticsBackgroundService>();

        return services;
    }
}
