using UniStay.Domain.Entities.Payments;

namespace UniStay.Application.Abstractions;

public interface IInvoicePdfService
{
    byte[] Generate(InvoiceEntity invoice);
}
