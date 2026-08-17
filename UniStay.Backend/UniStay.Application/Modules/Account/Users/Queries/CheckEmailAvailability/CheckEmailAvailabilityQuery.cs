namespace UniStay.Application.Modules.Account.Users.Queries.CheckEmailAvailability;

public sealed record CheckEmailAvailabilityQuery(string Email) : IRequest<CheckEmailAvailabilityResult>;
