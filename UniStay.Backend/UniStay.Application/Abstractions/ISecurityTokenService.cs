namespace UniStay.Application.Abstractions;

public interface ISecurityTokenService
{
    string GenerateSecureToken(int length = 48);
    string GenerateNumericCode(int digits = 6);
    string Hash(string value);
}
