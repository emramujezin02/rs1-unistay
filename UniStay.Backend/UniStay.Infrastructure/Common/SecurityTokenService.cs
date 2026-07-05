using UniStay.Application.Abstractions;
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;
using System.Text;

namespace UniStay.Infrastructure.Common;

public sealed class SecurityTokenService : ISecurityTokenService
{
    public string GenerateSecureToken(int length = 48)
    {
        return Base64UrlEncoder.Encode(RandomNumberGenerator.GetBytes(length));
    }

    public string GenerateNumericCode(int digits = 6)
    {
        var max = (int)Math.Pow(10, digits);
        var value = RandomNumberGenerator.GetInt32(0, max);
        return value.ToString().PadLeft(digits, '0');
    }

    public string Hash(string value)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(value));
        return Base64UrlEncoder.Encode(bytes);
    }
}
