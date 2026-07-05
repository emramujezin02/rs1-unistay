namespace UniStay.Application.Common.Exceptions;

public sealed class UniStayNotFoundException : Exception
{
    public UniStayNotFoundException(string message) : base(message) { }
}
