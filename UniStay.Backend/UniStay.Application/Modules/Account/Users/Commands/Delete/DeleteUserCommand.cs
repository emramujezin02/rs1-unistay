namespace UniStay.Application.Modules.Account.Users.Commands.Delete;

public sealed class DeleteUserCommand : IRequest<Unit>
{
    public int Id { get; set; }
}
