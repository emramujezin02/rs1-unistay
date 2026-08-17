using UniStay.Application.Modules.Account.Users.Queries.CheckEmailAvailability;
using UniStay.Application.Modules.Account.Users.Queries.CheckUsernameAvailability;

namespace UniStay.API.Controllers;

[ApiController]
[Route("api/users")]
public sealed class UserAvailabilityController(ISender sender) : ControllerBase
{
    [HttpGet("check-email")]
    [AllowAnonymous]
    public async Task<ActionResult<CheckEmailAvailabilityResult>> CheckEmail(
        [FromQuery] string email,
        CancellationToken ct)
    {
        var result = await sender.Send(new CheckEmailAvailabilityQuery(email), ct);
        return Ok(result);
    }

    [HttpGet("check-username")]
    [AllowAnonymous]
    public async Task<ActionResult<CheckUsernameAvailabilityResult>> CheckUsername(
        [FromQuery] string username,
        CancellationToken ct)
    {
        var result = await sender.Send(new CheckUsernameAvailabilityQuery(username), ct);
        return Ok(result);
    }
}
