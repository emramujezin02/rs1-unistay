using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using UniStay.Application.Modules.Account.Security.Commands.SetAnswers;
using UniStay.Application.Modules.Account.Security.Commands.VerifyAnswers;
using UniStay.Application.Modules.Account.Security.Queries.GetAnswered;
using UniStay.Application.Modules.Account.Security.Queries.GetQuestionsForUser;
using UniStay.Application.Modules.Account.Security.Queries.GetRecoveryQuestions;
using UniStay.Application.Modules.Account.Security.Queries.ListQuestions;

namespace UniStay.API.Controllers;

[ApiController]
[Route("api/account/security")]
public sealed class AccountSecurityController(ISender sender) : ControllerBase
{
    [HttpGet("questions")]
    [AllowAnonymous]
    public async Task<IReadOnlyList<ListSecurityQuestionsQueryDto>> GetAllQuestions(CancellationToken ct)
    {
        return await sender.Send(new ListSecurityQuestionsQuery(), ct);
    }

    [HttpGet("questions-for-user")]
    [Authorize]
    public async Task<IReadOnlyList<GetSecurityQuestionsForUserQueryDto>> GetQuestionsForUser(
        CancellationToken ct)
    {
        return await sender.Send(new GetSecurityQuestionsForUserQuery(), ct);
    }

    [HttpGet("recovery-questions")]
    [AllowAnonymous]
    [Microsoft.AspNetCore.RateLimiting.EnableRateLimiting("password-reset-send")]
    public async Task<IReadOnlyList<GetRecoverySecurityQuestionsQueryDto>> GetRecoveryQuestions([FromQuery] string recoveryContextId, CancellationToken ct)
    {
        return await sender.Send(new GetRecoverySecurityQuestionsQuery { RecoveryContextId = recoveryContextId }, ct);
    }

    [HttpGet("answered")]
    [Authorize]
    public async Task<IReadOnlyList<GetAnsweredSecurityQuestionsQueryDto>> GetAnsweredQuestions(
        CancellationToken ct)
    {
        return await sender.Send(new GetAnsweredSecurityQuestionsQuery(), ct);
    }

    [HttpPost("set")]
    [Authorize]
    public async Task<IActionResult> SetUserAnswers([FromBody] SetSecurityAnswersCommand command, CancellationToken ct)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub)
            ?? User.FindFirstValue("nameid");

        if (!int.TryParse(userIdClaim, out var userId) || userId <= 0)
            return Unauthorized();

        command.UserId = userId;
        await sender.Send(command, ct);
        return NoContent();
    }

    [HttpPost("verify")]
    [AllowAnonymous]
    public async Task<VerifySecurityAnswersCommandDto> VerifyAnswers([FromBody] VerifySecurityAnswersCommand command, CancellationToken ct)
    {
        return await sender.Send(command, ct);
    }
}


