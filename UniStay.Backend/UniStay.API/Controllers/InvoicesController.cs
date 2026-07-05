using UniStay.Application.Modules.Payments.Commands.CreateInvoice;
using UniStay.Application.Modules.Payments.Queries.GetAllInvoices;
using UniStay.Application.Modules.Payments.Queries.GetInvoicePdf;
using UniStay.Application.Modules.Payments.Queries.GetInvoicesByUser;

namespace UniStay.API.Controllers;

[ApiController]
[Authorize]
[Route("api/invoices")]
public sealed class InvoicesController(ISender sender) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<CreateInvoiceResult>> Create(
        [FromBody] CreateInvoiceCommand command,
        CancellationToken cancellationToken)
    {
        var result = await sender.Send(command, cancellationToken);
        return Ok(result);
    }

    [HttpGet("all")]
    public async Task<ActionResult<GetAllInvoicesResult>> GetAll(CancellationToken cancellationToken)
    {
        var result = await sender.Send(new GetAllInvoicesQuery(), cancellationToken);
        return Ok(result);
    }

    [HttpGet("my")]
    public async Task<ActionResult<GetInvoicesByUserResult>> GetMy(CancellationToken cancellationToken)
    {
        var result = await sender.Send(new GetInvoicesByUserQuery(), cancellationToken);
        return Ok(result);
    }

    [HttpGet("user/{studentId:int}")]
    public async Task<ActionResult<GetInvoicesByUserResult>> GetByUser(
        [FromRoute] int studentId,
        CancellationToken cancellationToken)
    {
        var result = await sender.Send(new GetInvoicesByUserQuery(studentId), cancellationToken);
        return Ok(result);
    }

    [HttpGet("{invoiceId:int}/pdf")]
    public async Task<IActionResult> GetPdf(
        [FromRoute] int invoiceId,
        CancellationToken cancellationToken)
    {
        var result = await sender.Send(new GetInvoicePdfQuery(invoiceId), cancellationToken);

        return File(
            result.PdfBytes,
            "application/pdf",
            result.FileName);
    }
}
