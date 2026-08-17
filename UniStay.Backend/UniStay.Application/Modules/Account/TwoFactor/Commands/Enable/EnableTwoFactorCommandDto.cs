namespace UniStay.Application.Modules.Account.TwoFactor.Commands.Enable;

public sealed class EnableTwoFactorCommandDto
{
    public IReadOnlyList<string> BackupCodes { get; set; } = Array.Empty<string>();
}
