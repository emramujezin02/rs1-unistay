namespace UniStay.Application.Modules.Account.Profile.Commands.SetCurrentTheme;

public sealed record SetCurrentThemeCommand(string Theme) : IRequest<SetCurrentThemeResult>;
