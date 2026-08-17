using UniStay.Application.Modules.Account.Users.Commands.Create;
using UniStay.Application.Modules.Account.Users.Commands.Delete;
using UniStay.Application.Modules.Account.Users.Commands.Update;
using UniStay.Application.Modules.Account.Users.Common;
using UniStay.Application.Modules.Account.Users.Queries.GetById;
using UniStay.Application.Modules.Account.Users.Queries.List;
using UniStay.Application.Modules.Account.Profile.Commands.ChangeCurrentPassword;
using UniStay.Application.Modules.Account.Profile.Commands.SetCurrentTheme;
using UniStay.Application.Modules.Account.Profile.Commands.UpdateCurrentProfile;
using UniStay.Application.Modules.Account.Profile.Common;

namespace UniStay.API.Controllers;

[ApiController]
[Authorize]
[Route("[controller]")]
[Route("api/[controller]")]
public sealed class UsersController(ISender sender) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<int>> Create(CreateUserCommand command, CancellationToken ct)
    {
        int id = await sender.Send(command, ct);

        return CreatedAtAction(nameof(GetById), new { id }, new { id });
    }

    [HttpPut("{id:int}")]
    public async Task Update(int id, UpdateUserCommand command, CancellationToken ct)
    {
        command.Id = id;
        await sender.Send(command, ct);
    }

    [HttpPut("me")]
    public async Task<ActionResult<ProfileDto>> UpdateCurrentProfile(UpdateCurrentProfileCommand command, CancellationToken ct)
    {
        return Ok(await sender.Send(command, ct));
    }

    [HttpPost("change-password")]
    public async Task<ActionResult<ChangeCurrentPasswordResult>> ChangePassword(
        ChangeCurrentPasswordCommand command,
        CancellationToken ct)
    {
        return Ok(await sender.Send(command, ct));
    }

    [HttpPost("theme")]
    public async Task<ActionResult<SetCurrentThemeResult>> SetTheme(
        SetCurrentThemeCommand command,
        CancellationToken ct)
    {
        return Ok(await sender.Send(command, ct));
    }

    [HttpDelete("{id:int}")]
    public async Task Delete(int id, CancellationToken ct)
    {
        await sender.Send(new DeleteUserCommand { Id = id }, ct);
    }

    [HttpGet("{id:int}")]
    public async Task<UserDto> GetById(int id, CancellationToken ct)
    {
        return await sender.Send(new GetUserByIdQuery { Id = id }, ct);
    }

    [HttpGet]
    public async Task<PageResult<UserDto>> List([FromQuery] ListUsersQuery query, CancellationToken ct)
    {
        return await sender.Send(query, ct);
    }
}
