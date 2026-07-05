using UniStay.Domain.Entities.Payments;

namespace UniStay.Infrastructure.Database.Configurations.Payments;

public sealed class PaymentConfiguration : IEntityTypeConfiguration<PaymentEntity>
{
    public void Configure(EntityTypeBuilder<PaymentEntity> builder)
    {
        builder.ToTable("Payments");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Amount)
            .HasColumnType("decimal(18,2)")
            .IsRequired();

        builder.Property(x => x.PaymentDate)
            .IsRequired();

        builder.Property(x => x.PaymentMethod)
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(x => x.PaymentStatus)
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(x => x.ReferenceNumber)
            .HasMaxLength(100)
            .IsRequired();

        builder.HasOne(x => x.Student)
            .WithMany()
            .HasForeignKey(x => x.StudentId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Invoice)
            .WithMany(x => x.Payments)
            .HasForeignKey(x => x.InvoiceId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(x => x.StudentId);
        builder.HasIndex(x => x.InvoiceId);
        builder.HasIndex(x => x.ReferenceNumber);
    }
}
