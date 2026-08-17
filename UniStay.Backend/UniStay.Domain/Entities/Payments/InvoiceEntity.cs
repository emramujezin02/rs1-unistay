using UniStay.Domain.Common;
using UniStay.Domain.Entities.Identity;

namespace UniStay.Domain.Entities.Payments;

public sealed class InvoiceEntity : BaseEntity
{
    public decimal TotalAmount { get; set; }
    public bool IssuedAt { get; set; }
    public bool Paid { get; set; }
    public bool EmailSent { get; set; }

    public int StudentId { get; set; }
    public UniStayUserEntity? Student { get; set; }

    public ICollection<PaymentEntity> Payments { get; set; } = new List<PaymentEntity>();
}
