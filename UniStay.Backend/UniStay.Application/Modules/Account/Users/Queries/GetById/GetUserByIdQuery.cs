using UniStay.Application.Modules.Account.Users.Common;

namespace UniStay.Application.Modules.Account.Users.Queries.GetById;

public sealed class GetUserByIdQuery : IRequest<UserDto>
{
    public int Id { get; set; }
}
