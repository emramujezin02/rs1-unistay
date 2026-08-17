namespace UniStay.Application.Modules.Account.Users.Queries.CheckUsernameAvailability;

public sealed record CheckUsernameAvailabilityQuery(string Username) : IRequest<CheckUsernameAvailabilityResult>;
