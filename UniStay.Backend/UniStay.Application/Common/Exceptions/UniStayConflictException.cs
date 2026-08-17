namespace UniStay.Application.Common.Exceptions;

public sealed class UniStayConflictException : Exception
{
    public UniStayConflictException(string message) : base(message) { }
}
