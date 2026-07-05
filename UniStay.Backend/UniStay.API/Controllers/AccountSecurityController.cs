using UniStay.Application.Modules.Account.Security.Commands.SetAnswers;
using UniStay.Application.Modules.Account.Security.Commands.VerifyAnswers;
using UniStay.Application.Modules.Account.Security.Queries.GetAnswered;
using UniStay.Application.Modules.Account.Security.Queries.GetQuestionsForUser;
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
    [AllowAnonymous]
    public async Task<IReadOnlyList<GetSecurityQuestionsForUserQueryDto>> GetQuestionsForUser([FromQuery] string email, CancellationToken ct)
    {
        return await sender.Send(new GetSecurityQuestionsForUserQuery { Email = email }, ct);
    }

    [HttpGet("answered")]
    [AllowAnonymous]
    public async Task<IReadOnlyList<GetAnsweredSecurityQuestionsQueryDto>> GetAnsweredQuestions([FromQuery] string email, CancellationToken ct)
    {
        return await sender.Send(new GetAnsweredSecurityQuestionsQuery { Email = email }, ct);
    }

    [HttpPost("set")]
    [Authorize]
    public async Task SetUserAnswers([FromBody] SetSecurityAnswersCommand command, CancellationToken ct)
    {
        await sender.Send(command, ct);
    }

    [HttpPost("verify")]
    [AllowAnonymous]
    public async Task<VerifySecurityAnswersCommandDto> VerifyAnswers([FromBody] VerifySecurityAnswersCommand command, CancellationToken ct)
    {
        return await sender.Send(command, ct);
    }
}
