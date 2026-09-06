using UniStay.Application.Abstractions;

namespace UniStay.Tests.Services;

public sealed class FakeAppCurrentUser(int? userId = null, bool isAdmin = false, bool isEmployee = false) : IAppCurrentUser
{
    public int? UserId { get; } = userId;
    public string? Email => null;
    public bool IsAuthenticated => UserId.HasValue;
    public bool IsAdmin { get; } = isAdmin;
    public bool IsManager => false;
    public bool IsEmployee { get; } = isEmployee;
}
