namespace UniStay.Application.Modules.Payments.Queries.GetInvoicesByUser;

public sealed record GetInvoicesByUserQuery(int? StudentId = null) : IRequest<GetInvoicesByUserResult>;
