using UniStay.Application.Modules.Auth.Commands.Login;
using UniStay.Application.Modules.Auth.Commands.Logout;
using UniStay.Application.Modules.Auth.Commands.Refresh;
using UniStay.Application.Modules.Account.Users.Commands.Register;
using UniStay.Application.Modules.Account.Profile.Common;
using UniStay.Application.Modules.Account.Profile.Queries.GetCurrentProfile;
using UniStay.API.Models;
using UniStay.Application.Abstractions;

[ApiController]
[Route("api/auth")]
public sealed class AuthController(IMediator mediator, ICaptchaService captcha) : ControllerBase
{
    [HttpPost("register")]
    [AllowAnonymous]
    [Microsoft.AspNetCore.RateLimiting.EnableRateLimiting("register")]
    public async Task<ActionResult<RegisterUserResult>> Register([FromBody] RegisterRequest request, CancellationToken ct)
    {
        var captchaOk = await captcha.VerifyAsync(request.CaptchaToken, ct);
        if (!captchaOk)
        {
            return BadRequest(new { detail = "CAPTCHA verification failed. Please try again." });
        }

        var command = new RegisterUserCommand(
            request.Username,
            request.Email,
            request.Password,
            request.FirstName,
            request.LastName,
            request.InviteToken);

        return Ok(await mediator.Send(command, ct));
    }

    [HttpPost("login")]
    [AllowAnonymous]
    [Microsoft.AspNetCore.RateLimiting.EnableRateLimiting("login")]
    public async Task<ActionResult<LoginCommandDto>> Login([FromBody] LoginRequest request, CancellationToken ct)
    {
        var captchaOk = await captcha.VerifyAsync(request.CaptchaToken, ct);
        if (!captchaOk)
        {
            return BadRequest(new { detail = "CAPTCHA verification failed. Please try again." });
        }

        var command = new LoginCommand
        {
            Email = request.Email,
            Password = request.Password,
            RememberMe = request.RememberMe,
            Fingerprint = request.Fingerprint
        };

        return Ok(await mediator.Send(command, ct));
    }

    [HttpPost("refresh")]
    [AllowAnonymous]
    public async Task<ActionResult<LoginCommandDto>> Refresh([FromBody] RefreshTokenCommand command, CancellationToken ct)
    {
        return Ok(await mediator.Send(command, ct));
    }

    [AllowAnonymous]
    [HttpPost("logout")]
    public async Task Logout([FromBody] LogoutCommand command, CancellationToken ct)
    {
        await mediator.Send(command, ct);
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<ProfileDto>> GetCurrentUser(CancellationToken ct)
    {
        return Ok(await mediator.Send(new GetCurrentProfileQuery(), ct));
    }
}


