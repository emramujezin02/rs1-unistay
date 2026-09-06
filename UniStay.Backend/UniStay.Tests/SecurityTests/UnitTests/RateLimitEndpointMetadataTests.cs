using System.Reflection;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.RateLimiting;
using UniStay.API.Controllers;

namespace UniStay.Tests.SecurityTests.UnitTests;

public sealed class RateLimitEndpointMetadataTests
{
    [Fact]
    public void InviteSend_RequiresAuthenticatedUser_AndHasDedicatedRateLimit()
    {
        var method = GetAction(typeof(InvitesController), nameof(InvitesController.Send));

        Assert.Contains(method.GetCustomAttributes<AuthorizeAttribute>(), _ => true);
        Assert.DoesNotContain(method.GetCustomAttributes<AllowAnonymousAttribute>(), _ => true);
        AssertRateLimitPolicy(method, "invite-send");
    }

    [Theory]
    [InlineData(nameof(TwoFactorController.SendCode), "two-factor-send-code")]
    [InlineData(nameof(TwoFactorController.Verify), "two-factor-verify")]
    public void TwoFactorPreLoginActions_RemainAnonymous_AndHaveRateLimits(
        string actionName,
        string policyName)
    {
        var method = GetAction(typeof(TwoFactorController), actionName);

        Assert.Contains(method.GetCustomAttributes<AllowAnonymousAttribute>(), _ => true);
        AssertRateLimitPolicy(method, policyName);
    }

    [Fact]
    public void PasswordResetTokenSend_RemainsAnonymous_AndHasRateLimit()
    {
        var method = GetAction(typeof(AccountPasswordController), nameof(AccountPasswordController.SendEmailToken));

        Assert.Contains(method.GetCustomAttributes<AllowAnonymousAttribute>(), _ => true);
        AssertRateLimitPolicy(method, "password-reset-send");
    }

    [Theory]
    [InlineData(nameof(AuthController.Login), "login")]
    [InlineData(nameof(AuthController.Register), "register")]
    public void ExistingAuthRateLimitPolicies_AreStillApplied(string actionName, string policyName)
    {
        var method = GetAction(typeof(AuthController), actionName);

        Assert.Contains(method.GetCustomAttributes<AllowAnonymousAttribute>(), _ => true);
        AssertRateLimitPolicy(method, policyName);
    }

    private static MethodInfo GetAction(Type controllerType, string actionName) =>
        controllerType.GetMethod(actionName)
        ?? throw new InvalidOperationException($"Missing controller action {controllerType.Name}.{actionName}.");

    private static void AssertRateLimitPolicy(MethodInfo method, string policyName)
    {
        var attribute = Assert.Single(method.GetCustomAttributes<EnableRateLimitingAttribute>());

        Assert.Equal(policyName, attribute.PolicyName);
    }
}
