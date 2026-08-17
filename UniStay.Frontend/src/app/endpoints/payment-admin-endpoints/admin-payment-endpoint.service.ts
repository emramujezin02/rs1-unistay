import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { MyConfig } from '../../my-config';
import { AdminInvoice, AdminInvoiceApi, AdminInvoicesApiResponse } from './admin-payment.models';

@Injectable({
  providedIn: 'root'
})
export class AdminPaymentEndpointService {
  private readonly apiUrl = `${MyConfig.baseUrl}/api/invoices`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<AdminInvoice[]> {
    return this.http.get<AdminInvoiceApi[] | AdminInvoicesApiResponse>(`${this.apiUrl}/all`).pipe(
      map(response => {
        const invoices = Array.isArray(response)
          ? response
          : response.invoices ?? response.Invoices ?? [];

        return invoices.map(item => this.mapInvoice(item));
      })
    );
  }

  downloadPdf(invoiceId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${invoiceId}/pdf`, {
      responseType: 'blob'
    });
  }

  private mapInvoice(item: AdminInvoiceApi): AdminInvoice {
    return {
      invoiceId: item.invoiceId ?? item.invoiceID ?? item.InvoiceId ?? item.InvoiceID ?? 0,
      totalAmount: item.totalAmount ?? item.TotalAmount ?? 0,
      paid: item.paid ?? item.Paid ?? false,
      issuedAt: item.issuedAt ?? item.IssuedAt ?? '',
      paidAt: item.paidAt ?? item.PaidAt ?? null
    };
  }
}
