import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyConfig } from '../../my-config';

@Injectable({
  providedIn: 'root'
})
export class GetInvoicePdfEndpointService {

  private readonly apiUrl = `${MyConfig.baseUrl}/api/invoices`;

  constructor(private http: HttpClient) {}

  downloadInvoicePdf(invoiceId: number): Observable<Blob> {
    return this.http.get(
      `${this.apiUrl}/${invoiceId}/pdf`,
      {
        responseType: 'blob'
      }
    );
  }
}
