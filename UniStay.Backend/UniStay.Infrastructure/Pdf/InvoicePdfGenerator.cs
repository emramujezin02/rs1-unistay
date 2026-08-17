using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using UniStay.Application.Abstractions;
using UniStay.Domain.Entities.Payments;

namespace UniStay.Infrastructure.Pdf;

public sealed class InvoicePdfGenerator : IInvoicePdfService
{
    public byte[] Generate(InvoiceEntity invoice)
    {
        QuestPDF.Settings.License = LicenseType.Community;

        return Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(40);

                page.Header().Row(row =>
                {
                    row.RelativeItem()
                        .Text("UniStay")
                        .FontSize(20)
                        .Bold()
                        .FontColor(Colors.Blue.Medium);

                    row.ConstantItem(200)
                        .AlignRight()
                        .Text($"ID -> #{invoice.Id}")
                        .FontSize(12)
                        .SemiBold();
                });

                page.Content().PaddingVertical(30).Column(col =>
                {
                    col.Item()
                        .PaddingBottom(15)
                        .Text("Invoice Details")
                        .FontSize(16)
                        .Bold();

                    col.Item().Row(r =>
                    {
                        r.RelativeItem().Text("Student ID:");
                        r.ConstantItem(200)
                            .AlignRight()
                            .Text(invoice.StudentId.ToString())
                            .SemiBold();
                    });

                    col.Item().Row(r =>
                    {
                        r.RelativeItem().Text("Total Amount:");
                        r.ConstantItem(200)
                            .AlignRight()
                            .Text($"{invoice.TotalAmount:0.00} KM")
                            .SemiBold();
                    });

                    col.Item().Row(r =>
                    {
                        r.RelativeItem().Text("Status:");
                        r.ConstantItem(200)
                            .AlignRight()
                            .Text(invoice.Paid ? "PAID" : "UNPAID")
                            .FontColor(invoice.Paid ? Colors.Green.Medium : Colors.Red.Medium)
                            .SemiBold();
                    });
                });

                page.Footer().AlignCenter().Text(text =>
                {
                    text.Span("Issued on: ");
                    text.Span(DateTime.Now.ToString("dd.MM.yyyy")).SemiBold();
                });
            });
        })
        .GeneratePdf();
    }
}
