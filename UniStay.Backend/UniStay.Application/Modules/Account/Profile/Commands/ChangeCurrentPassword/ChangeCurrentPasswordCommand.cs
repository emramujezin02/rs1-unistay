namespace UniStay.Application.Modules.Account.Profile.Commands.ChangeCurrentPassword;

public sealed record ChangeCurrentPasswordCommand(
    string CurrentPassword,
    string NewPassword) : IRequest<ChangeCurrentPasswordResult>;
