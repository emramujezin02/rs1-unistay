using UniStay.Domain.Common;
using UniStay.Domain.Entities.Identity;

namespace UniStay.Domain.Entities.Payments;

public sealed class PaymentEntity : BaseEntity
{
    public decimal Amount { get; set; }
    public DateTime PaymentDate { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public string PaymentStatus { get; set; } = string.Empty;
    public string ReferenceNumber { get; set; } = string.Empty;

    public int StudentId { get; set; }
    public UniStayUserEntity? Student { get; set; }

    public int InvoiceId { get; set; }
    public InvoiceEntity? Invoice { get; set; }
}
