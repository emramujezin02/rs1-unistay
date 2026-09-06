using Microsoft.AspNetCore.Authorization;
using UniStay.API.Controllers;

namespace UniStay.Tests.SecurityTests.UnitTests;

public class ControllerAuthorizeMetadataTests
{
    [Theory]
    [InlineData(typeof(FaultsController))]
    [InlineData(typeof(EquipmentController))]
    [InlineData(typeof(EquipmentItemsController))]
    [InlineData(typeof(AnalyticsController))]
    public void Sensitive_Controllers_Should_Require_Authenticated_Users(Type controllerType)
    {
        Assert.Contains(controllerType.GetCustomAttributes(typeof(AuthorizeAttribute), inherit: true), _ => true);
        Assert.DoesNotContain(controllerType.GetCustomAttributes(typeof(AllowAnonymousAttribute), inherit: true), _ => true);
    }
}
