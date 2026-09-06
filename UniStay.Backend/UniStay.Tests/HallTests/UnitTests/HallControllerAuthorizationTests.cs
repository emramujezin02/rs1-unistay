using System.Reflection;
using Microsoft.AspNetCore.Authorization;
using UniStay.API.Controllers;

namespace UniStay.Tests.HallTests.UnitTests;

public class HallControllerAuthorizationTests
{
    [Fact]
    public void Halls_Controller_Should_Require_Authorization()
    {
        var controllerType = typeof(HallsController);

        Assert.Contains(controllerType.GetCustomAttributes<AuthorizeAttribute>(), _ => true);
        Assert.DoesNotContain(controllerType.GetCustomAttributes<AllowAnonymousAttribute>(), _ => true);
    }

    [Theory]
    [InlineData(nameof(HallsController.Create))]
    [InlineData(nameof(HallsController.Update))]
    [InlineData(nameof(HallsController.Delete))]
    [InlineData(nameof(HallsController.LegacyCreate))]
    [InlineData(nameof(HallsController.LegacyUpdate))]
    [InlineData(nameof(HallsController.LegacyDelete))]
    public void Hall_Write_Actions_Should_Not_Allow_Anonymous(string methodName)
    {
        var method = typeof(HallsController).GetMethod(methodName);

        Assert.NotNull(method);
        Assert.DoesNotContain(method!.GetCustomAttributes<AllowAnonymousAttribute>(), _ => true);
    }
}
