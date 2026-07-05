import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MyConfig } from '../../my-config';

export interface Invoice {
  invoiceID: number;
  totalAmount: number;
  paid: boolean;
  issuedAt: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class GetInvoicesByUserIdEndpointService {

  private readonly apiUrl = `${MyConfig.baseUrl}/api/invoices`;

  constructor(private http: HttpClient) {}

  getByUserId(userId: number): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}/user/${userId}`);
  }
}
